# HealthVision AI Model Training Guides

This folder contains the scripts needed to train the Fall Detection model on Kaggle.

## Files Description
- `preprocess.py`: Extracts skeletal keypoints from your video dataset using YOLOv8.
- `model.py`: Defines the Neural Network architecture (Bi-LSTM).
- `train.ipynb`: Jupyter Notebook to run the training process.
- `requirements.txt`: List of python libraries needed.

## Instructions for Kaggle

1. **Upload Scripts**:
   - Create a NEW Notebook in Kaggle.
   - Upload `preprocess.py` and `model.py` to the notebook session (Add Data -> Upload).

2. **Run the Notebook**:
   - Open `train.ipynb` (or copy its contents into your Kaggle notebook).
   - **Run All Cells**.
   - The notebook is now configured to:
     1. Automatically download the **UR Fall Detection** and **NTU Violence** datasets using `kagglehub`.
     2. Organize the video files into training folders (`fall/`, `normal/`).
     3. Preprocess the videos to extract keypoints.
     4. Train the LSTM model.
     5. Save `fall_detection_model.tflite`.

3. **Download Result**:
   - Look for `fall_detection_model.tflite` in the Output section of the notebook.
   - Send this file to me to integrate into the Android app.
