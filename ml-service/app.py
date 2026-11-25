
import json
from pathlib import Path

import joblib
import numpy as np

from flask import Flask, jsonify, request

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "model.joblib"
METRICS_PATH = BASE_DIR / "metrics.json"

app = Flask(__name__)

FEATURES = [
    "education_level",
    "skill_count",
    "interest_match",
    "goal_match",
    "completed_courses",
    "completion_rate",
    "avg_quiz_score",
    "course_duration",
    "prerequisite_count",
    "tag_count",
    "course_difficulty_code",
]

model = None
metrics = None


def load_model():
    global model, metrics

    if not MODEL_PATH.exists() or not METRICS_PATH.exists():
        raise RuntimeError(
            "Model files are missing. Run train.py first."
        )

    model = joblib.load(MODEL_PATH)

    with open(METRICS_PATH, "r", encoding="utf-8") as file:
        metrics = json.load(file)


@app.get("/health")
def health():
    return jsonify({
        "success": True,
        "service": "LearnAI ML Service",
        "model_loaded": model is not None,
    })


@app.get("/metrics")
def get_metrics():
    if metrics is None:
        return jsonify({
            "success": False,
            "message": "Model metrics are unavailable.",
        }), 503

    return jsonify(metrics)


@app.post("/predict")
def predict():
    if model is None:
        return jsonify({
            "success": False,
            "message": "Model is not loaded.",
        }), 503

    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({
            "success": False,
            "message": "A JSON object is required.",
        }), 400

    missing = [
        feature
        for feature in FEATURES
        if feature not in payload
    ]

    if missing:
        return jsonify({
            "success": False,
            "message": "Missing required features.",
            "missing_features": missing,
        }), 400

    try:
        values = [float(payload[feature]) for feature in FEATURES]

        if not np.all(np.isfinite(values)):
            raise ValueError("Features must be finite numbers.")

        if not 0 <= values[5] <= 1:
            raise ValueError("completion_rate must be between 0 and 1.")

        if not 0 <= values[6] <= 100:
            raise ValueError("avg_quiz_score must be between 0 and 100.")

        features = np.array([values], dtype=float)

        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]

        confidence = float(np.max(probabilities))

        return jsonify({
            "success": True,
            "predicted_level": str(prediction),
            "confidence": round(confidence, 4),
            "model_version": metrics["model_version"],
        })

    except (TypeError, ValueError) as error:
        return jsonify({
            "success": False,
            "message": str(error),
        }), 400

    except Exception as error:
        app.logger.exception("Prediction failed")

        return jsonify({
            "success": False,
            "message": "Prediction could not be completed.",
        }), 500


# Load the trained model when the application starts
load_model()

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=8000,
        debug=False,
    )