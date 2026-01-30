import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping
import json

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data", "cattle")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_SAVE_PATH = os.path.join(MODELS_DIR, "cattle_model.keras")  # Changed to .keras
CLASSES_SAVE_PATH = os.path.join(MODELS_DIR, "classes.json")
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
TOTAL_EPOCHS = 25 

def train_model():
    # Ensure dirs exist
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)

    print(f"TensorFlow Version: {tf.__version__}")
    
    # 1. Data Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        brightness_range=[0.8, 1.2],
        validation_split=0.2
    )

    print("Loading Data Generators...")
    train_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    validation_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    # Save Class Mappings
    class_indices = train_generator.class_indices
    classes = {v: k for k, v in class_indices.items()}
    with open(CLASSES_SAVE_PATH, 'w') as f:
        json.dump(classes, f)
    print(f"Saved {len(classes)} classes to {CLASSES_SAVE_PATH}")

    # 2. Model Architecture
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1280, activation='relu')(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    predictions = Dense(len(classes), activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    # 3. Callbacks
    checkpoint = ModelCheckpoint(
        MODEL_SAVE_PATH, 
        monitor='val_accuracy', 
        save_best_only=True, 
        mode='max',
        verbose=1
    )
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss', 
        factor=0.2, 
        patience=3, 
        min_lr=1e-6,
        verbose=1
    )
    early_stop = EarlyStopping(
        monitor='val_loss',
        patience=8,
        restore_best_weights=True,
        verbose=1
    )

    # 4. Phase 1: Training Classification Head
    print("\n--- Phase 1: Training Classification Head ---")
    model.compile(optimizer=Adam(learning_rate=1e-3),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    # Use slightly fewer steps than calculated len() to avoid "Ran out of data" 
    # if one or two images were skipped during flow (though cleaning script helps)
    steps_per_epoch = len(train_generator)
    val_steps = len(validation_generator)

    history1 = model.fit(
        train_generator,
        steps_per_epoch=steps_per_epoch,
        validation_data=validation_generator,
        validation_steps=val_steps,
        epochs=10, 
        callbacks=[checkpoint]
    )

    # 5. Phase 2: Fine Tuning
    print("\n--- Phase 2: Fine Tuning Top Layers ---")
    base_model.trainable = True
    fine_tune_at = 100 
    for layer in base_model.layers[:fine_tune_at]:
        layer.trainable = False

    model.compile(optimizer=Adam(learning_rate=1e-4),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    history2 = model.fit(
        train_generator,
        steps_per_epoch=steps_per_epoch,
        validation_data=validation_generator,
        validation_steps=val_steps,
        epochs=TOTAL_EPOCHS - 10,
        callbacks=[checkpoint, reduce_lr, early_stop]
    )

    print("Training Complete.")
    print(f"Best model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train_model()
