import numpy as np
from typing import Any, Dict, List

CONV_KERNELS = {
    "sobel_x": np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=float),
    "sobel_y": np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=float),
    "laplacian": np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], dtype=float),
    "gaussian_blur": (1.0 / 16.0) * np.array([[1, 2, 1], [2, 4, 2], [1, 2, 1]], dtype=float),
    "sharpen": np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=float)
}

def apply_convolution_filter(image_matrix: List[List[float]], filter_type: str = "sobel_x") -> Dict[str, Any]:
    """Apply a 3x3 spatial convolution kernel over an input 2D image matrix."""
    img = np.array(image_matrix, dtype=float)
    if img.ndim != 2:
        return {"error": "Image must be a 2D grayscale matrix."}

    kernel = CONV_KERNELS.get(filter_type, CONV_KERNELS["sobel_x"])
    H, W = img.shape
    kH, kW = kernel.shape
    pad_h, pad_w = kH // 2, kW // 2

    # Zero-padding
    padded = np.pad(img, ((pad_h, pad_h), (pad_w, pad_w)), mode="constant", constant_values=0)
    output = np.zeros_like(img)

    for i in range(H):
        for j in range(W):
            region = padded[i:i + kH, j:j + kW]
            output[i, j] = np.sum(region * kernel)

    return {
        "filter_applied": filter_type,
        "input_shape": [H, W],
        "output_matrix": np.round(output, 2).tolist(),
        "kernel_used": kernel.tolist(),
        "min_val": round(float(output.min()), 2),
        "max_val": round(float(output.max()), 2)
    }

def calculate_iou(box_a: List[float], box_b: List[float]) -> float:
    """
    Compute Intersection over Union (IoU) for two boxes formatted as [x1, y1, x2, y2].
    """
    xA = max(box_a[0], box_b[0])
    yA = max(box_a[1], box_b[1])
    xB = min(box_a[2], box_b[2])
    yB = min(box_a[3], box_b[3])

    inter_width = max(0.0, xB - xA)
    inter_height = max(0.0, yB - yA)
    inter_area = inter_width * inter_height

    box_a_area = (box_a[2] - box_a[0]) * (box_a[3] - box_a[1])
    box_b_area = (box_b[2] - box_b[0]) * (box_b[3] - box_b[1])
    union_area = box_a_area + box_b_area - inter_area

    if union_area <= 1e-9:
        return 0.0

    return inter_area / union_area

def evaluate_detection_boxes(
    predictions: List[Dict[str, Any]],
    ground_truths: List[Dict[str, Any]],
    iou_threshold: float = 0.5
) -> Dict[str, Any]:
    """
    Match predicted bounding boxes against ground truth at IoU threshold,
    computing True Positives, False Positives, False Negatives, Precision, Recall.
    """
    matched_gt = set()
    tp = 0
    fp = 0
    matches_info = []

    for pred in predictions:
        pred_box = pred["bbox"]
        best_iou = 0.0
        best_gt_idx = -1

        for gt_idx, gt in enumerate(ground_truths):
            if gt_idx in matched_gt:
                continue
            if pred.get("label") == gt.get("label"):
                iou = calculate_iou(pred_box, gt["bbox"])
                if iou > best_iou:
                    best_iou = iou
                    best_gt_idx = gt_idx

        if best_iou >= iou_threshold and best_gt_idx != -1:
            tp += 1
            matched_gt.add(best_gt_idx)
            matches_info.append({"pred_box": pred_box, "iou": round(best_iou, 4), "result": "TP"})
        else:
            fp += 1
            matches_info.append({"pred_box": pred_box, "iou": round(best_iou, 4), "result": "FP"})

    fn = len(ground_truths) - len(matched_gt)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0

    return {
        "iou_threshold": iou_threshold,
        "true_positives": tp,
        "false_positives": fp,
        "false_negatives": fn,
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(2 * precision * recall / (precision + recall), 4) if (precision + recall) > 0 else 0.0,
        "details": matches_info
    }
