import numpy as np
import tensorflow as tf
from PIL import Image
import base64
from io import BytesIO

# Load pre-trained GAN model
model = tf.keras.models.load_model("path/to/stylegan_model.h5")

def generate_avatar(data):
    noise = np.random.randn(1, 512)  # Random latent vector
    avatar = model.predict(noise)
    
    img = Image.fromarray((avatar[0] * 255).astype(np.uint8))
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode("utf-8")
