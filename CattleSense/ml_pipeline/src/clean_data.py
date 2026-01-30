import os
from PIL import Image
import sys

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data", "cattle")

def clean_data():
    print(f"Scanning dataset in {DATA_DIR}...")
    
    corrupt_count = 0
    converted_count = 0
    total_count = 0

    if not os.path.exists(DATA_DIR):
        print("Data directory not found!")
        return

    for breed_folder in os.listdir(DATA_DIR):
        breed_path = os.path.join(DATA_DIR, breed_folder)
        if not os.path.isdir(breed_path):
            continue

        for filename in os.listdir(breed_path):
            file_path = os.path.join(breed_path, filename)
            total_count += 1
            
            try:
                with Image.open(file_path) as img:
                    img.load() # Force load pixel data
                    mode = img.mode
                    info = img.info.copy() # Copy info to avoid keeping ref
                
                # Re-open if we need to convert and save (now that the handle is closed)
                # Check for transparency/palette issues or non-RGB
                if mode in ('P', 'RGBA', 'LA') or (mode == 'P' and 'transparency' in info):
                    # Convert to RGB
                    # We need to open again to convert safely? 
                    # Actually, if we loaded it, we can just use the object if we didn't use 'with' or if we copied it. 
                    # Better pattern for overwrite:
                    
                    with Image.open(file_path) as img:
                        rgb_img = img.convert('RGB')
                    
                    # Now original is closed, we can save
                    rgb_img.save(file_path) 
                    converted_count += 1
                    
                # Full verification
                with Image.open(file_path) as img:
                    img.verify() 

            except (IOError, SyntaxError, OSError) as e:
                print(f"Deleting corrupt image: {filename} - {e}")
                try:
                    os.remove(file_path)
                    corrupt_count += 1
                except:
                    pass
            except Exception as e:
                 print(f"Error processing {filename}: {e}")

    print("-" * 30)
    print(f"Scanning Complete.")
    print(f"Total Images: {total_count}")
    print(f"Converted to RGB: {converted_count}")
    print(f"Deleted Corrupt: {corrupt_count}")

if __name__ == "__main__":
    clean_data()
