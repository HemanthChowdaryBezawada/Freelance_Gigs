import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import random

class BreedClassifier:
    def __init__(self, model_path=r"..\..\models\cattle_model.keras", classes_path=r"..\..\models\classes.json"):
        self.model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), model_path))
        self.classes_path = os.path.abspath(os.path.join(os.path.dirname(__file__), classes_path))
        self.model = None
        self.classes = {}
        self.mock_classes = ["Murrah", "Gir", "Sahiwal", "Jaffarabadi", "Nili-Ravi"]

        self._load_resources()

    def _load_resources(self):
        # Try loading classes
        if os.path.exists(self.classes_path):
            try:
                with open(self.classes_path, 'r') as f:
                    self.classes = json.load(f)
                    # JSON keys are strings ("0"), we need indices as ints (0)
                    self.int_to_class = {int(k): v for k, v in self.classes.items()}
                print(f"Loaded {len(self.classes)} classes.")
            except Exception as e:
                print(f"Error loading classes: {e}")

        # Try loading model
        if os.path.exists(self.model_path):
            try:
                print(f"Loading TensorFlow model from: {self.model_path}")
                self.model = load_model(self.model_path)
                print("Model loaded successfully.")
            except Exception as e:
                print(f"Error loading model: {e}")
        else:
            print(f"Model file not found at: {self.model_path}")
            print("Using Mock mode.")

    def predict(self, image_path):
        # REAL INFERENCE
        if self.model and self.int_to_class:
            try:
                print(f"Processing image at: {image_path}")
                # Preprocess
                img = image.load_img(image_path, target_size=(224, 224))
                img_array = image.img_to_array(img)
                img_array = np.expand_dims(img_array, axis=0)
                img_array /= 255.0  # Normalize

                print("Running mode.predict()...")
                # Predict
                predictions = self.model.predict(img_array)
                print("Raw predictions shape:", predictions.shape)
                
                top_indices = predictions[0].argsort()[-3:][::-1] # Top 3
                
                results = []
                for idx in top_indices:
                    confidence = float(predictions[0][idx])
                    breed_name = self.int_to_class.get(idx, "Unknown")
                    results.append({"breed": breed_name, "confidence": round(confidence, 2)})
                
                print(f"Formatted results: {results}")
                return results
            except Exception as e:
                print(f"Inference failed: {e}. Falling back to mock.")
                import traceback
                traceback.print_exc()
        
        # MOCK FALLBACK
        print("Returning simulated prediction.")
        top_breeds = random.sample(self.mock_classes, 3)
        return [
            {"breed": top_breeds[0], "confidence": 0.88},
            {"breed": top_breeds[1], "confidence": 0.08},
            {"breed": top_breeds[2], "confidence": 0.04}
        ]
