import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def build_fall_detection_model(input_shape, num_classes):
    """
    Builds a Hybrid LSTM-based classification model for fall detection.
    
    Args:
        input_shape: Tuple (time_steps, num_features). 
                     E.g., (30, 34) for 30 frames of 17 keypoints (x,y).
        num_classes: Number of output classes (e.g., 3: Normal, Fall, Lying Down).
        
    Returns:
        A compiled Keras model.
    """
    inputs = keras.Input(shape=input_shape)

    # 1. Feature Processing
    # Masking is roughly handled by the robustness of LSTM, 
    # but we can add a coordinate projection layer if needed.
    x = layers.Dense(64, activation="relu")(inputs)
    x = layers.Dropout(0.2)(x)

    # 2. Temporal Analysis (Bi-Directional LSTM)
    # Bidirectional because a fall is context-dependent (what happened before and after)
    x = layers.Bidirectional(layers.LSTM(64, return_sequences=True))(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Bidirectional(layers.LSTM(64, return_sequences=False))(x) # Last state only
    x = layers.Dropout(0.3)(x)

    # 3. Classification Head
    x = layers.Dense(32, activation="relu")(x)
    x = layers.BatchNormalization()(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = keras.Model(inputs=inputs, outputs=outputs, name="HealthVision_FallDetector")

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    return model

def build_transformer_model(input_shape, num_classes):
    """
    Alternative: Transformer Encoder for time-series.
    Often more accurate but heavier.
    """
    inputs = keras.Input(shape=input_shape)
    
    # Projection
    x = layers.Dense(64)(inputs)
    
    # Transformer Block
    # MultiHeadAttention
    attention_output = layers.MultiHeadAttention(num_heads=4, key_dim=64)(x, x)
    # Add & Norm
    x2 = layers.Add()([x, attention_output])
    x2 = layers.LayerNormalization(epsilon=1e-6)(x2)
    
    # Feed Forward
    x3 = layers.Dense(64, activation="relu")(x2)
    x3 = layers.Dense(64)(x3)
    # Add & Norm
    x = layers.Add()([x2, x3])
    x = layers.LayerNormalization(epsilon=1e-6)(x)
    
    # Global Average Pooling
    x = layers.GlobalAveragePooling1D()(x)
    x = layers.Dropout(0.4)(x)
    
    outputs = layers.Dense(num_classes, activation="softmax")(x)
    
    model = keras.Model(inputs=inputs, outputs=outputs, name="HealthVision_Transformer")
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.0005),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model
