import os
import json

DATA_DIR = r"C:\Users\heman\Desktop\Vivek\CattleSense\ml_pipeline\data\cattle"

def inspect_data():
    if not os.path.exists(DATA_DIR):
        print(f"Error: Directory {DATA_DIR} does not exist.")
        return

    stats = {}
    total_images = 0
    
    breeds = [d for d in os.listdir(DATA_DIR) if os.path.isdir(os.path.join(DATA_DIR, d))]
    
    print(f"Found {len(breeds)} breeds.")
    
    for breed in breeds:
        breed_path = os.path.join(DATA_DIR, breed)
        images = [f for f in os.listdir(breed_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif'))]
        count = len(images)
        stats[breed] = count
        total_images += count
        
    print(f"Total Images: {total_images}")
    print(json.dumps(stats, indent=2))

if __name__ == "__main__":
    inspect_data()
