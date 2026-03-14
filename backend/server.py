from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai import OpenAITextToSpeech, OpenAISpeechToText
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Environment variables
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
JWT_SECRET = os.environ.get('JWT_SECRET', 'default_secret')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Initialize AI services
tts_service = OpenAITextToSpeech(api_key=EMERGENT_LLM_KEY)
stt_service = OpenAISpeechToText(api_key=EMERGENT_LLM_KEY)

# ==================== MODELS ====================

class UserSignup(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    mobile: str
    password: str
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    highest_qualification: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[str] = None
    current_status: Optional[str] = None
    skills: Optional[str] = None
    linkedin: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: EmailStr
    mobile: str
    hashed_password: str
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    highest_qualification: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[str] = None
    current_status: Optional[str] = None
    skills: Optional[str] = None
    linkedin: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InterviewRequest(BaseModel):
    degree: str
    domain: str
    difficulty: str

class Interview(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    degree: str
    domain: str
    difficulty: str
    questions: List[str] = []
    answers: List[str] = []
    feedback: Optional[Dict[str, Any]] = None
    score: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed: bool = False

class AnswerSubmit(BaseModel):
    interview_id: str
    question_index: int
    answer: str

class TTSRequest(BaseModel):
    text: str

class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    mobile: str
    highest_qualification: Optional[str] = None
    current_status: Optional[str] = None

class InterviewResponse(BaseModel):
    id: str
    degree: str
    domain: str
    difficulty: str
    questions: List[str]
    score: Optional[float] = None
    created_at: str
    completed: bool

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    return verify_token(token)

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/signup")
async def signup(user_data: UserSignup):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_pw = hash_password(user_data.password)
    user_dict = user_data.model_dump()
    user_dict.pop('password')
    user_dict['hashed_password'] = hashed_pw
    
    user = User(**user_dict)
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.users.insert_one(doc)
    
    token = create_token(user.id)
    return {"token": token, "user": UserResponse(**user.model_dump())}

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    user_doc = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(login_data.password, user_doc['hashed_password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user_doc['id'])
    return {"token": token, "user": UserResponse(**user_doc)}

@api_router.get("/user/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    return user_doc

# ==================== INTERVIEW ROUTES ====================

@api_router.post("/interview/generate")
async def generate_interview(req: InterviewRequest, user_id: str = Depends(get_current_user)):
    # Generate 10 questions using GPT-5.2
    prompt = f"""Generate exactly 10 interview questions for a {req.degree} candidate applying for {req.domain} position.
Difficulty level: {req.difficulty}

Return ONLY the questions, one per line, numbered 1-10.
Questions should be relevant, practical, and assess both technical knowledge and problem-solving skills."""
    
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"interview_{uuid.uuid4()}",
        system_message="You are an expert interviewer. Generate precise, relevant interview questions."
    ).with_model("openai", "gpt-5.2")
    
    response = await chat.send_message(UserMessage(text=prompt))
    
    # Parse questions
    lines = response.strip().split('\n')
    questions = [line.split('.', 1)[1].strip() if '.' in line else line.strip() 
                 for line in lines if line.strip()]
    questions = [q for q in questions if q][:10]
    
    # Create interview
    interview = Interview(
        user_id=user_id,
        degree=req.degree,
        domain=req.domain,
        difficulty=req.difficulty,
        questions=questions
    )
    
    doc = interview.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.interviews.insert_one(doc)
    
    return {"interview_id": interview.id, "questions": questions}

@api_router.post("/interview/answer")
async def submit_answer(answer_data: AnswerSubmit, user_id: str = Depends(get_current_user)):
    interview_doc = await db.interviews.find_one(
        {"id": answer_data.interview_id, "user_id": user_id},
        {"_id": 0}
    )
    
    if not interview_doc:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Update answers
    answers = interview_doc.get('answers', [])
    while len(answers) <= answer_data.question_index:
        answers.append("")
    answers[answer_data.question_index] = answer_data.answer
    
    await db.interviews.update_one(
        {"id": answer_data.interview_id},
        {"$set": {"answers": answers}}
    )
    
    return {"success": True}

@api_router.post("/interview/complete")
async def complete_interview(interview_id: str, user_id: str = Depends(get_current_user)):
    interview_doc = await db.interviews.find_one(
        {"id": interview_id, "user_id": user_id},
        {"_id": 0}
    )
    
    if not interview_doc:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    questions = interview_doc['questions']
    answers = interview_doc.get('answers', [])
    
    # Generate feedback using GPT-5.2
    feedback_prompt = f"""Analyze this mock interview performance:

Degree: {interview_doc['degree']}
Domain: {interview_doc['domain']}
Difficulty: {interview_doc['difficulty']}

Questions and Answers:
"""
    for i, (q, a) in enumerate(zip(questions, answers), 1):
        feedback_prompt += f"\nQ{i}: {q}\nA{i}: {a}\n"
    
    feedback_prompt += """

Provide a detailed evaluation in JSON format:
{
  "overall_score": 7.5,
  "technical_knowledge": 8,
  "communication": 7,
  "confidence": 7,
  "clarity": 8,
  "problem_solving": 7,
  "detailed_feedback": "Detailed analysis here...",
  "improvements": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}"""
    
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"feedback_{interview_id}",
        system_message="You are an expert interview evaluator. Provide honest, constructive feedback."
    ).with_model("openai", "gpt-5.2")
    
    response = await chat.send_message(UserMessage(text=feedback_prompt))
    
    # Parse feedback
    import json
    try:
        feedback = json.loads(response.strip())
    except:
        feedback = {
            "overall_score": 7.0,
            "technical_knowledge": 7,
            "communication": 7,
            "confidence": 7,
            "clarity": 7,
            "problem_solving": 7,
            "detailed_feedback": response,
            "improvements": ["Continue practicing", "Focus on clarity", "Build confidence"]
        }
    
    await db.interviews.update_one(
        {"id": interview_id},
        {"$set": {
            "feedback": feedback,
            "score": feedback.get('overall_score', 7.0),
            "completed": True
        }}
    )
    
    return feedback

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(user_id: str = Depends(get_current_user)):
    interviews = await db.interviews.find(
        {"user_id": user_id},
        {"_id": 0}
    ).to_list(1000)
    
    total = len(interviews)
    completed = len([i for i in interviews if i.get('completed', False)])
    avg_score = sum([i.get('score', 0) for i in interviews if i.get('score')]) / completed if completed > 0 else 0
    
    # Recent interviews
    recent = sorted(interviews, key=lambda x: x.get('created_at', ''), reverse=True)[:5]
    recent_formatted = []
    for interview in recent:
        recent_formatted.append({
            "id": interview['id'],
            "degree": interview['degree'],
            "domain": interview['domain'],
            "difficulty": interview['difficulty'],
            "score": interview.get('score'),
            "created_at": interview['created_at'],
            "completed": interview.get('completed', False)
        })
    
    return {
        "total_interviews": total,
        "completed_interviews": completed,
        "average_score": round(avg_score, 1),
        "recent_interviews": recent_formatted
    }

@api_router.get("/interview/{interview_id}")
async def get_interview(interview_id: str, user_id: str = Depends(get_current_user)):
    interview_doc = await db.interviews.find_one(
        {"id": interview_id, "user_id": user_id},
        {"_id": 0}
    )
    
    if not interview_doc:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    return interview_doc

# ==================== TTS/STT ROUTES ====================

@api_router.post("/tts/speak")
async def text_to_speech(tts_req: TTSRequest):
    try:
        audio_bytes = await tts_service.generate_speech(
            text=tts_req.text,
            model="tts-1",
            voice="nova"
        )
        
        # Convert to base64 for frontend
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        return {"audio": audio_base64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/stt/transcribe")
async def speech_to_text(file: UploadFile = File(...)):
    try:
        # Read audio file
        audio_data = await file.read()
        
        # Create a temporary file-like object
        from io import BytesIO
        audio_file = BytesIO(audio_data)
        audio_file.name = file.filename
        
        response = await stt_service.transcribe(
            file=audio_file,
            model="whisper-1",
            response_format="json"
        )
        
        return {"text": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/")
async def root():
    return {"message": "AI Mock Interview API - Ready"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
