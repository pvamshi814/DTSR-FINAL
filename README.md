# AI Mock Interview System

A full-stack AI-powered mock interview application with Google Gemini integration and browser-native voice features.

## 🚀 Features
- **AI Engine**: Powered by Google Gemini (`gemini-flash-latest`) for question generation and evaluation.
- **Voice Interface**: Browser-native Text-to-Speech (Assistant) and Real-time Speech Recognition (User).
- **Fair Evaluation**: Advanced prompt engineering ensuring generous marks for effort and partially related answers.
- **Deep Analysis**: Multi-paragraph feedback reports with 6-8+ actionable, deep technical improvement steps in a premium card-based UI.
- **Supabase Integration**: Robust authentication and data storage.
- **Vercel Ready**: Pre-configured for seamless cloud deployment.

## 🛠️ Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Initialize Database:
   - Run the setup script to create the necessary `users` and `interviews` tables in your Supabase instance:
     ```bash
     python create_tables.py
     ```
4. Configure `.env`:
   - Fill in your `SUPABASE_URL`, `SUPABASE_KEY`, and `GEMINI_API_KEY` in `backend/.env`.
5. Run the server:
   ```bash
   uvicorn server:app --port 8000
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```

## 🌐 Deployment
This project is configured for Vercel. See [DEPLOY.md](./DEPLOY.md) for full instructions on deploying your own instance to the cloud.

## 📝 License
MIT
