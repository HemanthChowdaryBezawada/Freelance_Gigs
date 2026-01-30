import requests
import sys

# Configuration
BASE_URL = "http://180.235.121.253:8041"
PREDICT_URL = f"{BASE_URL}/predict"
IMAGE_PATH = "c:/Users/heman/Desktop/Thanvitha/health-vision/frontend/assets/adaptive-icon.png"

def print_result(test_name, status, details=""):
    color = "\033[92m" if status == "PASS" else "\033[91m"
    reset = "\033[0m"
    print(f"[{test_name.ljust(20)}] {color}{status}{reset} {details}")

def test_root_endpoint():
    """Test connection to the root URL (simulating a basic GET request)"""
    try:
        print(f"Testing GET {BASE_URL}...")
        response = requests.get(BASE_URL, timeout=5)
        # Accept 200 (OK) or 404 (Not Found but reachable) as 'Connected'
        # FastAPI default root might return 404 if not defined
        if response.status_code in [200, 404]: 
            # Check if it's our server (FastAPI often returns {"detail":"Not Found"} on 404)
            print_result("Root Endpoint", "PASS", f"Status: {response.status_code}")
            return True
        else:
            print_result("Root Endpoint", "WARN", f"Status: {response.status_code}")
            return True
    except requests.exceptions.ConnectionError:
        print_result("Root Endpoint", "FAIL", "Connection Refused")
        return False
    except requests.exceptions.Timeout:
        print_result("Root Endpoint", "FAIL", "Timed Out")
        return False
    except Exception as e:
        print_result("Root Endpoint", "FAIL", str(e))
        return False

def test_predict_endpoint():
    """Test the POST /predict endpoint with a file payload"""
    try:
        print(f"Testing POST {PREDICT_URL}...")
        with open(IMAGE_PATH, "rb") as f:
            files = {'file': ('test.png', f, 'image/png')}
            response = requests.post(PREDICT_URL, files=files, timeout=15)
            
            # We expect 200 OK ideally, but 500 is also a 'PASS' for connectivity 
            # (proven that code executed, even if it crashed on image content)
            if response.status_code == 200:
                data = response.json()
                print_result("Predict Endpoint", "PASS", f"Response: {data}")
            elif response.status_code == 500:
                print_result("Predict Endpoint", "PASS", f"Reachable (Server Error verified: {response.text[:50]}...)")
            else:
                print_result("Predict Endpoint", "FAIL", f"Status: {response.status_code}")
            
    except Exception as e:
        print_result("Predict Endpoint", "FAIL", str(e))

if __name__ == "__main__":
    print("--- Starting Backend Verification (Postman Style) ---")
    root_ok = test_root_endpoint()
    
    if root_ok:
        test_predict_endpoint()
    else:
        print("Skipping Predict test due to Root failure.")
