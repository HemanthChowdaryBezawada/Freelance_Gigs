import requests
import base64
import os

# Configuration
BACKEND_URL = "http://180.235.121.253:8041/predict"
IMAGE_PATH = "c:/Users/heman/Desktop/Thanvitha/health-vision/frontend/assets/adaptive-icon.png"  # Use an existing asset

def test_backend():
    print(f"Testing Backend at: {BACKEND_URL}")
    
    if not os.path.exists(IMAGE_PATH):
        print(f"Error: Test image not found at {IMAGE_PATH}")
        return

    try:
        with open(IMAGE_PATH, "rb") as f:
            files = {'file': ('test_image.png', f, 'image/png')}
            print(f"Sending request with {IMAGE_PATH}...")
            response = requests.post(BACKEND_URL, files=files, timeout=10)
            
            print(f"Status Code: {response.status_code}")
            try:
                print("Response JSON:", response.json())
            except Exception as e:
                print("Could not parse JSON:", response.text)
                
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_backend()
