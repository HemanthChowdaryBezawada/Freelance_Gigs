# Project Structure for CattleSense

## Overview
CattleSense is an AI-powered mobile application designed to identify indigenous Indian cattle breeds. The project is structured into three main components: a React Native mobile app, a FastAPI backend, and a Machine Learning pipeline.

## Directory Breakdown

### 1. `app/` (Mobile Application)
This directory contains the frontend code built with **React Native** and **Expo**.
- **`app/`**: Application source code using **Expo Router**.
    - **`(auth)/`**: Authentication screens (Login, OTP Verification).
    - **`(tabs)/`**: Main application tabs (Dashboard, History, Profile).
    - **`(stack)/`**: Stack screens (Camera, Analysis Results, Breed Library).
    - **`(onboarding)/`**: Initial setup and permission screens.
- **`assets/`**: Static resources (Images, Icons, Fonts).
- **`components/`**: Reusable UI components (Buttons, Cards, Headers).
- **`modules/`**: Custom Native Modules (e.g., `SubscriptionModule` for Android payment integration).
- **`services/`**: API communication layer (`api.ts`).
- **`store/`**: Global state management using **Zustand**.
- **`android/`**: Native Android code and configuration files (`build.gradle`, `AndroidManifest.xml`).

### 2. `backend/` (Server & API)
The backend is built with **FastAPI** (Python) to handle user data and synchronization.
- **`main.py`**: The entry point for the application. Defined API endpoints, database models (SQLAlchemy), and logic.
- **`requirements.txt`**: List of Python dependencies.
- **`uploads/`**: Directory where user-uploaded images are stored.
- **`database.db`**: SQLite database file (local development).

### 3. `ml_pipeline/` (Machine Learning)
Scripts and resources for training the breed identification model.
- **`src/`**: Python scripts for data cleaning, preprocessing, and training.
- **`models/`**: Stores trained models (e.g., `cattlesense_mobilenetv2.keras`).
- **`data/`**: (Ignored in git) Raw dataset of cattle images.

### 4. `deployment/`
Contains artifacts and information for app distribution.
- **`cattlesense-release.aab`**: The signed Android App Bundle for Play Store submission.
- **`deployment_details.md`**: Checklist and notes for release.

## Key Configuration Files
- **`app/app.json`**: Expo configuration (app name, version, slug).
- **`app/package.json`**: Javascript dependencies and scripts.
- **`app/android/gradle.properties`**: Gradle build settings.
