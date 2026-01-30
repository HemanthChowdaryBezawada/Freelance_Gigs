import os
import cv2
import glob
import numpy as np
from ultralytics import YOLO

def process_frame(frame, model):
    results = model(frame, verbose=False)
    if results[0].keypoints is not None and len(results[0].keypoints) > 0:
        kpts = results[0].keypoints.xyn.cpu().numpy()[0] 
        return kpts[:, :2].flatten()
    return np.zeros(34)

def extract_keypoints(source, model, sequence_length=30):
    frames_keypoints = []
    if os.path.isfile(source): # Video file
        cap = cv2.VideoCapture(source)
        while cap.isOpened():
            success, frame = cap.read()
            if not success: break
            frames_keypoints.append(process_frame(frame, model))
        cap.release()
    elif os.path.isdir(source): # Directory of images
        images = sorted(glob.glob(os.path.join(source, "*.png")))
        if not images: images = sorted(glob.glob(os.path.join(source, "*.jpg")))
        for img_path in images:
            frame = cv2.imread(img_path)
            if frame is not None: frames_keypoints.append(process_frame(frame, model))
            
    sequences = []
    if len(frames_keypoints) >= sequence_length:
        for i in range(len(frames_keypoints) - sequence_length):
            sequences.append(frames_keypoints[i : i + sequence_length])
    return np.array(sequences)

# Notebook-friendly Main execution (No argparse)
def main():
    dataset_path = "dataset_organized"
    output_path = "processed_data.npy"
    
    print(f"Starting Preprocessing on: {dataset_path}")
    
    # Load model
    print("Loading YOLOv8-Pose model...")
    model = YOLO('yolov8n-pose.pt') 
    
    all_sequences = []
    all_labels = []
    classes = {"normal": 0, "fall": 1, "lying_down": 2}

    for class_name, label_id in classes.items():
        class_dir = os.path.join(dataset_path, class_name)
        if not os.path.exists(class_dir):
            print(f"Skipping {class_dir} (Not found)")
            continue
            
        print(f"Processing class: {class_name}...")
        items = os.listdir(class_dir)
        print(f"Found {len(items)} items in {class_name}")
        
        count = 0
        for item_name in items:
            item_path = os.path.join(class_dir, item_name)
            seqs = extract_keypoints(item_path, model)
            if len(seqs) > 0:
                all_sequences.append(seqs)
                all_labels.append(np.full(len(seqs), label_id))
                count += 1
        print(f"Processed {count} valid inputs in {class_name}")

    if len(all_sequences) > 0:
        X = np.concatenate(all_sequences, axis=0)
        y = np.concatenate(all_labels, axis=0)
        np.save(output_path, {"X": X, "y": y})
        print(f"SUCCESS: Saved {len(X)} samples to {output_path}")
    else:
        print("No data processed. Folders might be empty.")

if __name__ == "__main__":
    main()
