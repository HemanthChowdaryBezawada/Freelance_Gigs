from fastapi import FastAPI, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
import sys
import os

# Add ml_pipeline to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ml_pipeline', 'src', 'models')))

# Try importing, mock if fails (for dev robustness)
try:
    from breed_classifier import BreedClassifier
except ImportError:
    class BreedClassifier:
        def predict(self, _): return [{"breed": "Mock", "confidence": 1.0}]

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount static files for images
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

classifier = BreedClassifier()

class Prediction(BaseModel):
    breed: str
    confidence: float

class PredictionResponse(BaseModel):
    predictions: List[Prediction]

# --- Database Setup (SQLite + SQLAlchemy) ---
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi import Depends, HTTPException, Form
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./cattle_sense.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    mobile = Column(String, unique=True, index=True)
    full_name = Column(String, default="Cattle Officer")
    email = Column(String, default="")
    location = Column(String, default="")
    role = Column(String, default="Veterinarian")
    profile_picture = Column(String, default="") # New column

class Scan(Base):
    __tablename__ = "scans"
    id = Column(Integer, primary_key=True, index=True)
    user_mobile = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    breed = Column(String, default="Unknown")
    confidence = Column(String, default="0.0")
    image_url = Column(String, default="")

Base.metadata.create_all(bind=engine)

# --- Migration Helper (Safe for Dev) ---
def migrate_db():
    from sqlalchemy import text
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN profile_picture VARCHAR DEFAULT ''"))
            print("Migrated DB: Added profile_picture column")
        except Exception as e:
            # Column likely exists
            pass

migrate_db()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Auth Models ---
class LoginRequest(BaseModel):
    mobile: str

class VerifyRequest(BaseModel):
    mobile: str
    otp: str

class ProfileUpdate(BaseModel):
    full_name: str
    email: str
    location: str
    role: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: str = None
    user: dict = None

# Mock DB for OTPs
otp_store = {}

# --- Twilio Setup ---
try:
    from twilio.rest import Client
except ImportError:
    Client = None

# Twilio credentials - Set these as environment variables before running
# Example: set TWILIO_ACCOUNT_SID=your_sid
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "") 
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "") 
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER", "") 

def send_sms(to_number: str, otp: str):
    if not Client or not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        print("Twilio not configured. Skipping SMS.")
        return False
    
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=f"Your Cattle Sense OTP is: {otp}",
            from_=TWILIO_PHONE_NUMBER,
            to=to_number
        )
        print(f"SMS sent: {message.sid}")
        return True
    except Exception as e:
        print(f"Failed to send SMS: {e}")
        return False

@app.post("/auth/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    print(f"Login request for: {request.mobile}")
    
    # Generate random 4-digit OTP
    import random
    mock_otp = str(random.randint(1000, 9999))
    # mock_otp = "1234"
    
    otp_store[request.mobile] = mock_otp
    print(f"Generated OTP for {request.mobile}: {mock_otp}")
    
    # Check if user exists, if not create placeholder
    user = db.query(User).filter(User.mobile == request.mobile).first()
    if not user:
        new_user = User(mobile=request.mobile)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"Created new user for mobile: {request.mobile}")
    
    # Attempt to send Real SMS
    # Format number to E.164 if needed (assuming input is 10 digits IN)
    ph = request.mobile
    if not ph.startswith("+"):
        ph = "+91" + ph # Default to India for this project
        
    sms_sent = send_sms(ph, mock_otp)
    # sms_sent = False # Disabled to save credits
    
    msg = "OTP sent successfully"
    if not sms_sent:
        msg += " (Failed to send SMS, check console)"
        print(f"DEBUG: OTP was {mock_otp}") # Fallback for dev if SMS fails
        
    return {"success": True, "message": msg}

@app.post("/auth/verify", response_model=AuthResponse)
def verify(request: VerifyRequest):
    print(f"Verify request for: {request.mobile} with OTP: {request.otp}")
    stored_otp = otp_store.get(request.mobile)
    
    if stored_otp and stored_otp == request.otp:
        # OTP matches
        return {"success": True, "message": "Login successful", "token": "mock-jwt-token-123"}
    
    return {"success": False, "message": "Invalid OTP. Please try again."}

@app.get("/profile/{mobile}")
def get_profile(mobile: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.mobile == mobile).first()
    if not user:
        # Auto-create user for dev/demo purposes if not found
        print(f"User {mobile} not found, auto-creating...")
        user = User(mobile=mobile)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return {
        "mobile": user.mobile,
        "full_name": user.full_name,
        "email": user.email,
        "location": user.location,
        "role": user.role,
        "profile_picture": user.profile_picture if user.profile_picture else ""
    }

@app.put("/profile/{mobile}")
def update_profile(mobile: str, profile: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.mobile == mobile).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.full_name = profile.full_name
    user.email = profile.email
    user.location = profile.location
    user.role = profile.role
    
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully"}

@app.post("/profile/upload")
async def upload_profile_picture(
    file: UploadFile = File(...),
    mobile: str = Form(...),
    db: Session = Depends(get_db)
):
    print(f"Uploading profile pic for {mobile}")
    
    user = db.query(User).filter(User.mobile == mobile).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"pfp_{mobile}_{timestamp}_{file.filename}"
    file_path = os.path.join(uploads_dir, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        # Update DB
        image_url_db = f"/uploads/{filename}"
        user.profile_picture = image_url_db
        db.commit()
        db.refresh(user)
        
        return {"success": True, "profile_picture": image_url_db}
    except Exception as e:
        print(f"Profile upload failed: {e}")
        raise HTTPException(status_code=500, detail="Upload failed")

@app.get("/stats/{mobile}")
def get_stats(mobile: str, db: Session = Depends(get_db)):
    # Total Scans
    total_scans = db.query(Scan).filter(Scan.user_mobile == mobile).count()
    
    # This Month Scans
    now = datetime.utcnow()
    this_month_scans = db.query(Scan).filter(
        Scan.user_mobile == mobile,
        func.strftime('%Y-%m', Scan.timestamp) == now.strftime('%Y-%m')
    ).count()
    
    return {
        "total_scans": total_scans,
        "this_month": this_month_scans
    }

@app.get("/scans/{mobile}")
def get_scans(mobile: str, db: Session = Depends(get_db)):
    scans = db.query(Scan).filter(Scan.user_mobile == mobile).order_by(Scan.timestamp.desc()).all()
    
    results = []
    for scan in scans:
        results.append({
            "id": scan.id,
            "breed": scan.breed,
            "confidence": float(scan.confidence),
            "date": scan.timestamp.strftime("%Y-%m-%d %H:%M"),
            "location": "India", # Placeholder
            "image": scan.image_url if scan.image_url else "https://via.placeholder.com/150"
        })
    return results

@app.get("/")
def read_root():
    return {"message": "Cattle Sense API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_breed(
    file: UploadFile = File(...), 
    mobile: str = Form("1234567890"), # Default for legacy/dev
    db: Session = Depends(get_db)
):
    print(f"Received prediction request for file: {file.filename} from user: {mobile}")
    
    # Use permanent uploads directory
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Create unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{mobile}_{timestamp}_{file.filename}"
    file_path = os.path.join(uploads_dir, filename)
    
    # Image URL (assuming localhost access from emulator/device needs loopback or IP)
    # We will store relative path or construct full URL. Storing relative is safer.
    # Frontend will prepend backend URL.
    image_url_db = f"/uploads/{filename}"

    try:
        print(f"Saving file to: {file_path}")
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        print("File saved successfully.")
            
        # Run prediction
        print("Calling classifier.predict()...")
        results = classifier.predict(file_path)
        print(f"Prediction results: {results}")
        
        # Record Scan in DB
        try:
            top_breed = results[0]['breed'] if results else "Unknown"
            top_conf = str(results[0]['confidence']) if results else "0.0"
            
            new_scan = Scan(
                user_mobile=mobile,
                breed=top_breed,
                confidence=top_conf,
                image_url=image_url_db
            )
            db.add(new_scan)
            db.commit()
            print(f"Scan recorded for {mobile} with image {image_url_db}")
        except Exception as e:
            print(f"Failed to log scan to DB: {e}")
            
        return {"predictions": results}
        
    except Exception as e:
        print(f"Error processing file in main.py: {e}")
        import traceback
        traceback.print_exc()
        return {"predictions": []}
        
    # No finally block to delete file, we keep it now!

if __name__ == "__main__":
    import uvicorn
    # Listen on all network interfaces so LAN devices can connect
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
