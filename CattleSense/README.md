# 🐄 CattleSense - AI-Powered Cattle Breed Identification

An intelligent mobile application for identifying indigenous Indian cattle breeds using computer vision and deep learning.

---

## 📱 Features

- **AI Breed Identification** - Capture or upload cattle images for instant breed prediction
- **Breed Library** - Comprehensive database of 40+ indigenous Indian cattle breeds
- **Scan History** - Track all your identifications with images and confidence scores
- **Offline Support** - Works without internet connectivity
- **User Profiles** - Personalized experience with profile management
- **Multi-language** - Support for English, Hindi, and Gujarati

---

## 🛠️ Technologies Used

| Component | Technology Used |
|-----------|-----------------|
| **Frontend** | React Native, Expo SDK 54 |
| **UI Design** | Custom React Native StyleSheet, Ionicons |
| **Local Storage** | Zustand + AsyncStorage |
| **Backend & Sync** | FastAPI (Python), REST API |
| **Database** | SQLite with SQLAlchemy ORM |
| **Authentication** | Twilio SMS OTP |
| **AI & Logic** | TensorFlow/Keras CNN (MobileNetV2 Transfer Learning) |
| **Image Processing** | Expo Camera, Expo Image Picker |
| **State Management** | Zustand (Persist Middleware) |
| **Tools** | VS Code, GitHub, Expo Go |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Expo Go app on your mobile device

### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Set Twilio credentials (optional for OTP)
set TWILIO_ACCOUNT_SID=your_sid
set TWILIO_AUTH_TOKEN=your_token
set TWILIO_PHONE_NUMBER=+1234567890

python main.py
```

### Mobile App Setup
```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go to run on your device.

---

## 📁 Project Structure

```
CattleSense/
├── app/                    # React Native Expo App
│   ├── app/               # Expo Router screens
│   │   ├── (auth)/        # Login, OTP verification
│   │   ├── (tabs)/        # Home, Records, Profile tabs
│   │   └── (stack)/       # Settings, Breed Library, Results
│   ├── assets/            # Images, breed photos
│   ├── store/             # Zustand state management
│   └── services/          # API integration
│
├── backend/               # FastAPI Backend
│   ├── main.py           # API endpoints
│   └── uploads/          # Stored images
│
└── ml_pipeline/          # Machine Learning
    ├── models/           # Trained model (.keras, .h5)
    ├── src/              # Training scripts
    └── data/             # Dataset (not in repo)
```

---

## 🤖 AI Model

- **Architecture**: MobileNetV2 with Transfer Learning
- **Training Data**: 40+ indigenous Indian cattle breeds
- **Accuracy**: ~85% on validation set
- **Output**: Top 3 breed predictions with confidence scores

---

## 📸 Screenshots

| Home | Scan | Results | Library |
|------|------|---------|---------|
| Dashboard with stats | Camera capture | Breed prediction | Browse breeds |

---

## 👥 Team

- **Vivek** - Developer

---

## 📄 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- Indigenous cattle breed data from National Bureau of Animal Genetic Resources (NBAGR)
- TensorFlow team for MobileNetV2 pretrained weights
