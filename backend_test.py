import requests
import sys
import json
from datetime import datetime

class AIInterviewAPITester:
    def __init__(self, base_url="https://ai-interview-prep-39.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.interview_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}" if not endpoint.startswith('/') else f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for file uploads
                    headers.pop('Content-Type', None)
                    response = requests.post(url, files=files, headers=headers, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json() if response.content else {}
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_health(self):
        """Test API health endpoint"""
        success, response = self.run_test(
            "API Health Check",
            "GET", 
            "/",
            200
        )
        return success

    def test_signup(self):
        """Test user signup"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user = {
            "first_name": "Test",
            "last_name": "User", 
            "email": f"test_user_{timestamp}@example.com",
            "mobile": f"9876543{timestamp[-3:]}",
            "password": "TestPass123!",
            "highest_qualification": "B.Tech",
            "current_status": "Student"
        }
        
        success, response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup", 
            200,
            data=test_user
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_login(self):
        """Test user login (if signup failed)"""
        if self.token:  # Already have token from signup
            return True
            
        login_data = {
            "email": "test@example.com",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_user_profile(self):
        """Test get user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "user/profile",
            200
        )
        return success

    def test_generate_interview(self):
        """Test interview generation"""
        interview_data = {
            "degree": "B.Tech",
            "domain": "Software Engineer", 
            "difficulty": "Medium"
        }
        
        success, response = self.run_test(
            "Generate Interview",
            "POST",
            "interview/generate",
            200,
            data=interview_data
        )
        
        if success and 'interview_id' in response:
            self.interview_id = response['interview_id']
            print(f"   Interview ID: {self.interview_id}")
            print(f"   Questions generated: {len(response.get('questions', []))}")
            return True
        return False

    def test_submit_answer(self):
        """Test answer submission"""
        if not self.interview_id:
            print("❌ No interview ID available for answer submission")
            return False
            
        answer_data = {
            "interview_id": self.interview_id,
            "question_index": 0,
            "answer": "This is a test answer for the first question. I have experience with Python, JavaScript, and React development."
        }
        
        success, response = self.run_test(
            "Submit Answer",
            "POST", 
            "interview/answer",
            200,
            data=answer_data
        )
        return success

    def test_complete_interview(self):
        """Test interview completion"""
        if not self.interview_id:
            print("❌ No interview ID available for completion")
            return False
            
        success, response = self.run_test(
            "Complete Interview",
            "POST",
            f"interview/complete?interview_id={self.interview_id}",
            200
        )
        
        if success:
            print(f"   Feedback received: {len(str(response.get('detailed_feedback', ''))) > 0}")
            print(f"   Overall score: {response.get('overall_score', 'N/A')}")
        return success

    def test_get_interview(self):
        """Test get interview details"""
        if not self.interview_id:
            print("❌ No interview ID available")
            return False
            
        success, response = self.run_test(
            "Get Interview Details",
            "GET",
            f"interview/{self.interview_id}",
            200
        )
        return success

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        success, response = self.run_test(
            "Dashboard Statistics",
            "GET",
            "dashboard/stats",
            200
        )
        
        if success:
            print(f"   Total interviews: {response.get('total_interviews', 0)}")
            print(f"   Completed interviews: {response.get('completed_interviews', 0)}")
            print(f"   Average score: {response.get('average_score', 0)}")
        return success

    def test_tts(self):
        """Test text-to-speech"""
        tts_data = {"text": "Hello, this is a test message."}
        
        success, response = self.run_test(
            "Text-to-Speech",
            "POST",
            "tts/speak",
            200,
            data=tts_data
        )
        
        if success and 'audio' in response:
            print(f"   Audio data received: {len(response['audio'])} characters")
        return success

def main():
    print("🚀 Starting AI Mock Interview API Tests")
    print("=" * 50)
    
    tester = AIInterviewAPITester()
    
    # Test sequence
    test_results = []
    
    # 1. Basic API Health
    test_results.append(("API Health", tester.test_api_health()))
    
    # 2. Authentication Flow
    test_results.append(("User Signup", tester.test_signup()))
    test_results.append(("User Profile", tester.test_user_profile()))
    
    # 3. Interview Flow
    test_results.append(("Generate Interview", tester.test_generate_interview()))
    test_results.append(("Submit Answer", tester.test_submit_answer()))
    test_results.append(("Complete Interview", tester.test_complete_interview()))
    test_results.append(("Get Interview", tester.test_get_interview()))
    
    # 4. Dashboard
    test_results.append(("Dashboard Stats", tester.test_dashboard_stats()))
    
    # 5. AI Features  
    test_results.append(("Text-to-Speech", tester.test_tts()))
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary")
    print("=" * 50)
    
    passed_tests = []
    failed_tests = []
    
    for test_name, result in test_results:
        if result:
            print(f"✅ {test_name}")
            passed_tests.append(test_name)
        else:
            print(f"❌ {test_name}")
            failed_tests.append(test_name)
    
    print(f"\n📈 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"🎯 Success rate: {success_rate:.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed tests: {', '.join(failed_tests)}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())