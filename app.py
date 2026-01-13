from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

# Load model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "baseline_model.h5")

model = tf.keras.models.load_model(model_path, compile=False)

# Load labels
with open(os.path.join(BASE_DIR, "labels.txt"), "r") as f:
    class_names = [line.strip() for line in f.readlines()]

IMG_SIZE = 32   # ✅ CIFAR-10 input size

@app.route("/")
def home():
    return "CIFAR-10 Image Classification API is running 🚀"

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Image preprocessing (MATCH TRAINING)
    img = Image.open(file).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))

    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # (1, 32, 32, 3)

    predictions = model.predict(img_array)
    confidence = float(np.max(predictions))
    predicted_class = class_names[np.argmax(predictions)]

    return jsonify({
        "class": predicted_class,
        "confidence": round(confidence * 100, 2)
    })

if __name__ == "__main__":
    app.run(debug=True)
