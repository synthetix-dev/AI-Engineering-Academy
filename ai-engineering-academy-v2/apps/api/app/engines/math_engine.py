import math
import numpy as np
from typing import Any, Dict, List

def compute_matrix_operations(matrix_a: List[List[float]], matrix_b: List[List[float]] | None = None) -> Dict[str, Any]:
    """Perform real matrix operations: determinant, inverse, eigenvalues, dot product."""
    A = np.array(matrix_a, dtype=float)
    if A.ndim != 2:
        return {"error": "Matrix A must be 2-dimensional."}

    rows, cols = A.shape
    result: Dict[str, Any] = {
        "shape": [rows, cols],
        "trace": float(np.trace(A)) if rows == cols else None,
        "norm_frobenius": float(np.linalg.norm(A)),
    }

    if rows == cols:
        det = float(np.linalg.det(A))
        result["determinant"] = round(det, 6)
        if abs(det) > 1e-9:
            inv = np.linalg.inv(A)
            result["inverse"] = np.round(inv, 4).tolist()
        else:
            result["inverse"] = "Singular matrix (non-invertible)"
        
        try:
            eigenvalues, eigenvectors = np.linalg.eig(A)
            result["eigenvalues"] = [round(float(np.real(ev)), 4) for ev in eigenvalues]
            result["eigenvectors"] = np.round(np.real(eigenvectors), 4).tolist()
        except Exception:
            result["eigenvalues"] = None

    if matrix_b is not None:
        B = np.array(matrix_b, dtype=float)
        if cols == B.shape[0]:
            dot_prod = np.dot(A, B)
            result["dot_product"] = np.round(dot_prod, 4).tolist()
            result["dot_product_shape"] = list(dot_prod.shape)
        else:
            result["dot_product_error"] = f"Incompatible shapes for multiplication: {A.shape} and {B.shape}"

    return result

def run_gradient_descent(
    learning_rate: float = 0.1,
    iterations: int = 40,
    loss_function: str = "quadratic", # "quadratic" f(x,y)=x^2+2y^2, "rosenbrock" f(x,y)=(1-x)^2 + 100(y-x^2)^2
    initial_point: List[float] = [3.0, 4.0]
) -> Dict[str, Any]:
    """
    Real gradient descent optimization tracking exact step coordinates,
    comparing analytical gradients with finite-difference numerical approximations.
    """
    x, y = float(initial_point[0]), float(initial_point[1])
    h = 1e-5 # finite difference step

    def eval_loss(px: float, py: float) -> float:
        if loss_function == "rosenbrock":
            return (1.0 - px) ** 2 + 100.0 * (py - px ** 2) ** 2
        # Default: Elliptic paraboloid
        return px ** 2 + 2.0 * (py ** 2)

    def analytical_grad(px: float, py: float) -> tuple[float, float]:
        if loss_function == "rosenbrock":
            df_dx = -2.0 * (1.0 - px) - 400.0 * px * (py - px ** 2)
            df_dy = 200.0 * (py - px ** 2)
            return df_dx, df_dy
        return 2.0 * px, 4.0 * py

    trajectory = []
    diff_errors = []

    for step in range(iterations):
        loss = eval_loss(x, y)
        gx_analyt, gy_analyt = analytical_grad(x, y)
        
        # Finite difference numerical gradient
        gx_num = (eval_loss(x + h, y) - eval_loss(x - h, y)) / (2 * h)
        gy_num = (eval_loss(x, y + h) - eval_loss(x, y - h)) / (2 * h)
        
        grad_error = math.sqrt((gx_analyt - gx_num) ** 2 + (gy_analyt - gy_num) ** 2)
        diff_errors.append(round(grad_error, 8))

        grad_norm = math.sqrt(gx_analyt ** 2 + gy_analyt ** 2)

        trajectory.append({
            "step": step,
            "x": round(x, 4),
            "y": round(y, 4),
            "loss": round(loss, 6),
            "grad_norm": round(grad_norm, 6)
        })

        # Gradient update with clipping
        clip_val = 50.0
        gx_clipped = max(-clip_val, min(clip_val, gx_analyt))
        gy_clipped = max(-clip_val, min(clip_val, gy_analyt))

        x -= learning_rate * gx_clipped
        y -= learning_rate * gy_clipped

        if grad_norm < 1e-5:
            break

    return {
        "final_point": [round(x, 4), round(y, 4)],
        "final_loss": round(eval_loss(x, y), 6),
        "steps_taken": len(trajectory),
        "converged": bool(trajectory[-1]["grad_norm"] < 1e-2),
        "mean_numerical_diff_error": float(np.mean(diff_errors)),
        "trajectory": trajectory
    }
