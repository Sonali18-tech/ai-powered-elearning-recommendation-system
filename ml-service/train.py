
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "model.joblib"
METRICS_PATH = BASE_DIR / "metrics.json"

MODEL_VERSION = "1.0.0"

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


def generate_dataset(rows=5000, random_state=42):
    rng = np.random.default_rng(random_state)

    data = pd.DataFrame({
        "education_level": rng.integers(0, 5, rows),
        "skill_count": rng.integers(0, 16, rows),
        "interest_match": rng.integers(0, 8, rows),
        "goal_match": rng.integers(0, 8, rows),
        "completed_courses": rng.integers(0, 15, rows),
        "completion_rate": rng.uniform(0, 1, rows),
        "avg_quiz_score": rng.uniform(0, 100, rows),
        "course_duration": rng.integers(1, 60, rows),
        "prerequisite_count": rng.integers(0, 8, rows),
        "tag_count": rng.integers(0, 12, rows),
        "course_difficulty_code": rng.integers(1, 4, rows),
    })

    # Synthetic readiness and course complexity relationship.
    readiness = (
        data["education_level"] * 0.8
        + data["skill_count"] * 0.25
        + data["interest_match"] * 0.8
        + data["goal_match"] * 0.9
        + data["completed_courses"] * 0.2
        + data["completion_rate"] * 2
        + data["avg_quiz_score"] * 0.04
    )

    complexity = (
        data["course_difficulty_code"] * 1.4
        + data["course_duration"] / 20
        + data["prerequisite_count"] * 0.7
    )

    margin = readiness - complexity

    data["target"] = np.select(
        [
            margin < 2,
            margin < 7,
        ],
        [
            "BEGINNER",
            "INTERMEDIATE",
        ],
        default="ADVANCED",
    )

    return data


def train_model():
    print("Generating synthetic training dataset...")

    data = generate_dataset()

    X = data[FEATURES]
    y = data["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    print("Training Random Forest Classifier...")

    model = RandomForestClassifier(
        n_estimators=250,
        max_depth=12,
        min_samples_split=4,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    report = classification_report(
        y_test,
        predictions,
        output_dict=True,
        zero_division=0,
    )

    matrix = confusion_matrix(
        y_test,
        predictions,
        labels=model.classes_,
    )

    feature_importance = dict(
        zip(
            FEATURES,
            model.feature_importances_.tolist(),
        )
    )

    joblib.dump(model, MODEL_PATH)

    metrics = {
        "model_type": "RandomForestClassifier",
        "model_version": MODEL_VERSION,
        "dataset_type": "Synthetic",
        "training_records": len(X_train),
        "testing_records": len(X_test),
        "accuracy": round(float(accuracy), 4),
        "classification_report": report,
        "confusion_matrix": matrix.tolist(),
        "class_labels": model.classes_.tolist(),
        "feature_importance": feature_importance,
    }

    with open(METRICS_PATH, "w", encoding="utf-8") as file:
        json.dump(metrics, file, indent=4)

    print("\nTraining completed.")
    print("Accuracy:", round(accuracy * 100, 2), "%")
    print("\nClassification report:")
    print(classification_report(y_test, predictions))

    print("Model saved:", MODEL_PATH)
    print("Metrics saved:", METRICS_PATH)


if __name__ == "__main__":
    train_model()
