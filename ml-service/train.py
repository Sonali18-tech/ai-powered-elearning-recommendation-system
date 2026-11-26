
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
DATASET_PATH = BASE_DIR / "data" / "learner_training_data.csv"

MODEL_VERSION = "2.0.0"

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

TARGETS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]


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
        [margin < 2, margin < 7],
        ["BEGINNER", "INTERMEDIATE"],
        default="ADVANCED",
    )

    return data


def load_training_data():
    if not DATASET_PATH.exists():
        print("Learner dataset not found.")
        print("Using synthetic fallback dataset.")
        return generate_dataset(), "Synthetic (fallback)"

    print("Loading real learner feedback dataset...")

    data = pd.read_csv(DATASET_PATH)

    required_columns = FEATURES + ["target"]
    missing = [
        column for column in required_columns
        if column not in data.columns
    ]

    if missing:
        raise ValueError(
            f"Dataset is missing columns: {missing}"
        )

    data = data[required_columns].copy()

    for column in FEATURES:
        data[column] = pd.to_numeric(
            data[column], errors="coerce"
        )

    data["target"] = data["target"].astype(str).str.upper()
    data = data.dropna()

    data = data[data["target"].isin(TARGETS)]

    if len(data) < 30:
        raise ValueError(
            f"Only {len(data)} valid observations found. "
            "Collect at least 30 before training."
        )

    class_counts = data["target"].value_counts()

    if len(class_counts) < 2 or class_counts.min() < 5:
        raise ValueError(
            "Need at least two target classes and at least "
            "five observations in each class."
        )

    if (
        (data["completion_rate"] < 0).any()
        or (data["completion_rate"] > 1).any()
        or (data["avg_quiz_score"] < 0).any()
        or (data["avg_quiz_score"] > 100).any()
    ):
        raise ValueError("Dataset contains out-of-range values.")

    non_negative_features = [
        "education_level",
        "skill_count",
        "interest_match",
        "goal_match",
        "completed_courses",
        "course_duration",
        "prerequisite_count",
        "tag_count",
    ]

    if (data[non_negative_features] < 0).any().any():
        raise ValueError("Dataset contains negative feature values.")

    if not data["education_level"].between(0, 4).all():
        raise ValueError("education_level must be between 0 and 4.")

    if not data["course_difficulty_code"].between(1, 3).all():
        raise ValueError(
            "course_difficulty_code must be between 1 and 3."
        )

    print("Valid learner observations:", len(data))
    print("Class distribution:")
    print(class_counts.to_dict())

    return data, "Learner Feedback"


def train_model():
    data, dataset_type = load_training_data()

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

    metrics = {
        "model_type": "RandomForestClassifier",
        "model_version": MODEL_VERSION,
        "dataset_type": dataset_type,
        "total_records": len(data),
        "training_records": len(X_train),
        "testing_records": len(X_test),
        "accuracy": round(float(accuracy), 4),
        "classification_report": report,
        "confusion_matrix": matrix.tolist(),
        "class_labels": model.classes_.tolist(),
        "class_distribution": {
            str(key): int(value)
            for key, value in y.value_counts().items()
        },
        "feature_importance": feature_importance,
    }

    # Save only after successful training and evaluation.
    joblib.dump(model, MODEL_PATH)

    with open(METRICS_PATH, "w", encoding="utf-8") as file:
        json.dump(metrics, file, indent=4)

    print("\nTraining completed.")
    print("Dataset:", dataset_type)
    print("Accuracy:", round(accuracy * 100, 2), "%")
    print("\nClassification report:")
    print(classification_report(y_test, predictions))

    print("Model saved:", MODEL_PATH)
    print("Metrics saved:", METRICS_PATH)


if __name__ == "__main__":
    train_model()
