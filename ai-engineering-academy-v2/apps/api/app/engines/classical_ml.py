import numpy as np
from typing import Any, Dict, List
from sklearn.datasets import make_classification, load_iris, load_wine
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_curve, auc
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

def train_classical_ml_model(
    algorithm: str = "random_forest",
    dataset_name: str = "synthetic", # synthetic, iris, wine
    test_size: float = 0.25,
    n_estimators: int = 100,
    max_depth: int = 5,
    seed: int = 42
) -> Dict[str, Any]:
    """Train real scikit-learn models on verified datasets, computing confusion matrix and metrics."""
    np.random.seed(seed)

    # 1. Load or generate data
    if dataset_name == "iris":
        data = load_iris()
        X, y = data.data, data.target
        feature_names = data.feature_names
        # Convert to binary for clean ROC-AUC analysis (class 0 vs others)
        y = (y == 0).astype(int)
    elif dataset_name == "wine":
        data = load_wine()
        X, y = data.data, data.target
        feature_names = data.feature_names
        y = (y == 0).astype(int)
    else:
        X, y = make_classification(
            n_samples=500,
            n_features=6,
            n_informative=4,
            n_redundant=1,
            random_state=seed
        )
        feature_names = [f"feature_{i}" for i in range(6)]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=seed, stratify=y
    )

    # 2. Select algorithm
    if algorithm == "logistic_regression":
        model = LogisticRegression(max_iter=500, random_state=seed)
    elif algorithm == "decision_tree":
        model = DecisionTreeClassifier(max_depth=max_depth, random_state=seed)
    elif algorithm == "gradient_boosting":
        model = GradientBoostingClassifier(n_estimators=n_estimators, max_depth=max_depth, random_state=seed)
    else: # random_forest
        model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, random_state=seed)

    # 3. Fit model
    model.fit(X_train, y_train)

    # 4. Predictions & evaluation
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else y_pred

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred).tolist()

    # ROC Curve coordinates
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    roc_auc_val = float(auc(fpr, tpr))
    # Downsample ROC points for UI chart rendering
    roc_points = [{"fpr": round(float(f), 4), "tpr": round(float(t), 4)} for f, t in zip(fpr[::max(1, len(fpr)//20)], tpr[::max(1, len(tpr)//20)])]

    # 5-fold cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5)

    # Feature importance
    feature_importances = {}
    if hasattr(model, "feature_importances_"):
        for name, imp in zip(feature_names, model.feature_importances_):
            feature_importances[name] = round(float(imp), 4)
    elif hasattr(model, "coef_"):
        for name, coef in zip(feature_names, model.coef_[0]):
            feature_importances[name] = round(float(abs(coef)), 4)

    return {
        "algorithm": algorithm,
        "dataset": dataset_name,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc_val, 4),
            "cv_5fold_mean": round(float(np.mean(cv_scores)), 4),
            "cv_5fold_std": round(float(np.std(cv_scores)), 4)
        },
        "confusion_matrix": cm,
        "roc_curve": roc_points,
        "feature_importances": feature_importances
    }
