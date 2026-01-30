from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import cv2
import io
from PIL import Image

# Import existing model logic 
# We assume the user has their YOLO model in place.
# If they are using ultralytics, we can use that directly.
try:
    from ultralytics import YOLO
except ImportError:
    print("Ultralytics not found. Please install it.")

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model (Global)
model = None

@app.on_event("startup")
async def startup_event():
    global model
    try:
        # Load the same YOLOv8n-pose model used in the project
        # Adjust path if needed or download if missing
        print("Loading AI Model...")
        model = YOLO("yolov8n-pose.pt") 
        print("Model Loaded Successfully!")
    except Exception as e:
        print(f"Failed to load model: {e}")

class Keypoint(BaseModel):
    x: float
    y: float
    conf: float

class AnalysisResult(BaseModel):
    isFall: bool = False
    confidence: float
    keypoints: List[float]
    status: str

@app.get("/")
def read_root():
    return {"status": "active", "service": "HealthVision AI Backend"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # 1. Read Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_np = np.array(image)

        # 2. Run Inference
        results = model(img_np)
        
        # 3. Process Results
        # Extract logic similar to frontend/ModelService.ts but in Python
        # This is 'Hybrid Mode' - utilizing Python's power for the same logic.
        
        final_result = {
            "isFall": False,
            "confidence": 0.0,
            "keypoints": [],
            "status": "normal"
        }

        for result in results:
            if result.keypoints is not None:
                # Extract keypoints (x,y,conf)
                kpts = result.keypoints.data[0].cpu().numpy() # [17, 3]
                
                # Flatten for frontend compatibility: [x1, y1, c1, x2, y2, c2...]
                flat_kpts = kpts.flatten().tolist()
                final_result["keypoints"] = flat_kpts
                
                # Biomechanics Logic (Python translation of our TS logic)
                # Keypoints (COCO): 0:Nose, 5:LShoulder, 6:RShoulder, 11:LHip, 12:RHip
                if len(kpts) >= 17:
                    nose = kpts[0]
                    l_shoulder = kpts[5]
                    r_shoulder = kpts[6]
                    l_hip = kpts[11]
                    r_hip = kpts[12]
                    
                    # Torso Angle
                    mid_shoulder = (l_shoulder[:2] + r_shoulder[:2]) / 2
                    mid_hip = (l_hip[:2] + r_hip[:2]) / 2
                    
                    dx = mid_hip[0] - mid_shoulder[0]
                    dy = mid_hip[1] - mid_shoulder[1]
                    
                    angle_rad = np.arctan2(abs(dx), abs(dy))
                    angle_deg = np.degrees(angle_rad)
                    
                    # Fall Detection Rules
                    confidence = 0.0
                    if angle_deg > 45:
                        confidence = 0.9 # Horizontal
                    elif angle_deg > 20:
                        confidence = 0.4 # Leaning
                        
                    if confidence > 0.5:
                        final_result["isFall"] = True
                        final_result["status"] = "fall"
                    
                    final_result["confidence"] = float(confidence)
                
                break # Just process first person

        return final_result

    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
