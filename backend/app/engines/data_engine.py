import re
import io
import pandas as pd
import numpy as np
from typing import Any, Dict, List

PII_PATTERNS = {
    "email": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
    "phone": r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}",
    "api_key": r"(?i)(api[_-]?key|secret|token)[\s:=]+['\"]?([a-zA-Z0-9_\-]{16,})['\"]?",
    "credit_card": r"\b(?:\d{4}[-\s]?){3}\d{4}\b"
}

def scan_dataset_for_pii(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Scan string columns for personally identifiable information (PII)."""
    warnings = []
    for col in df.select_dtypes(include=["object", "string"]).columns:
        sample_values = df[col].dropna().astype(str).head(100).tolist()
        for pii_type, pattern in PII_PATTERNS.items():
            matches = [v for v in sample_values if re.search(pattern, v)]
            if matches:
                warnings.append({
                    "column": col,
                    "pii_type": pii_type,
                    "detected_sample_count": len(matches),
                    "action_required": f"Column '{col}' appears to contain {pii_type}. Anonymization or redaction is required before public export."
                })
    return warnings

def profile_dataset(df: pd.DataFrame) -> Dict[str, Any]:
    """Generate statistical profile of a dataset."""
    summary = {
        "total_rows": int(len(df)),
        "total_columns": int(len(df.columns)),
        "columns": {}
    }

    for col in df.columns:
        col_type = str(df[col].dtype)
        null_count = int(df[col].isnull().sum())
        null_percent = round((null_count / len(df)) * 100, 2) if len(df) > 0 else 0
        unique_count = int(df[col].nunique())

        col_info: Dict[str, Any] = {
            "dtype": col_type,
            "null_count": null_count,
            "null_percent": null_percent,
            "unique_count": unique_count
        }

        if pd.api.types.is_numeric_dtype(df[col]):
            clean_series = df[col].dropna()
            if not clean_series.empty:
                col_info.update({
                    "min": round(float(clean_series.min()), 4),
                    "max": round(float(clean_series.max()), 4),
                    "mean": round(float(clean_series.mean()), 4),
                    "std": round(float(clean_series.std()), 4),
                    "median": round(float(clean_series.median()), 4)
                })
        else:
            top_vals = df[col].value_counts().head(3).to_dict()
            col_info["top_values"] = {str(k): int(v) for k, v in top_vals.items()}

        summary["columns"][col] = col_info

    summary["pii_warnings"] = scan_dataset_for_pii(df)
    return summary

def run_data_cleaning_pipeline(
    df: pd.DataFrame,
    impute_strategy: str = "mean", # mean, median, drop
    outlier_method: str = "iqr", # iqr, none
    scaling: str = "standard" # standard, minmax, none
) -> Dict[str, Any]:
    """Apply real cleaning and feature engineering transformations."""
    cleaned_df = df.copy()
    actions_taken = []

    # 1. Imputation of numerical columns
    numeric_cols = cleaned_df.select_dtypes(include=[np.number]).columns.tolist()
    for col in numeric_cols:
        null_count = cleaned_df[col].isnull().sum()
        if null_count > 0:
            if impute_strategy == "mean":
                fill_val = cleaned_df[col].mean()
                cleaned_df[col] = cleaned_df[col].fillna(fill_val)
                actions_taken.append(f"Imputed {null_count} nulls in '{col}' with mean ({round(fill_val, 4)})")
            elif impute_strategy == "median":
                fill_val = cleaned_df[col].median()
                cleaned_df[col] = cleaned_df[col].fillna(fill_val)
                actions_taken.append(f"Imputed {null_count} nulls in '{col}' with median ({round(fill_val, 4)})")
            elif impute_strategy == "drop":
                cleaned_df = cleaned_df.dropna(subset=[col])
                actions_taken.append(f"Dropped rows with null values in '{col}'")

    # 2. Outlier filtering
    if outlier_method == "iqr":
        initial_len = len(cleaned_df)
        for col in numeric_cols:
            q1 = cleaned_df[col].quantile(0.25)
            q3 = cleaned_df[col].quantile(0.75)
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            cleaned_df = cleaned_df[(cleaned_df[col] >= lower_bound) & (cleaned_df[col] <= upper_bound)]
        outliers_dropped = initial_len - len(cleaned_df)
        if outliers_dropped > 0:
            actions_taken.append(f"Removed {outliers_dropped} outlier rows using 1.5*IQR threshold")

    # 3. Scaling
    if scaling == "standard":
        for col in numeric_cols:
            mean = cleaned_df[col].mean()
            std = cleaned_df[col].std()
            if std > 1e-9:
                cleaned_df[col] = (cleaned_df[col] - mean) / std
        actions_taken.append("Applied StandardScaler (z-score normalization) to numeric columns")
    elif scaling == "minmax":
        for col in numeric_cols:
            min_val = cleaned_df[col].min()
            max_val = cleaned_df[col].max()
            if max_val - min_val > 1e-9:
                cleaned_df[col] = (cleaned_df[col] - min_val) / (max_val - min_val)
        actions_taken.append("Applied MinMaxScaler to range [0, 1]")

    return {
        "initial_rows": len(df),
        "cleaned_rows": len(cleaned_df),
        "actions_taken": actions_taken,
        "sample_preview": cleaned_df.head(10).to_dict(orient="records"),
        "numeric_stats": {col: {"mean": round(float(cleaned_df[col].mean()), 4), "std": round(float(cleaned_df[col].std()), 4)} for col in numeric_cols if col in cleaned_df}
    }
