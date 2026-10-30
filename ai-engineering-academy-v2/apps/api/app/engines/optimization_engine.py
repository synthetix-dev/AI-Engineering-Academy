import numpy as np
from typing import Any, Dict

def quantize_tensor_fp32_to_int8(
    tensor_data: list[float] | None = None,
    size: int = 1000,
    symmetric: bool = False,
    seed: int = 42
) -> Dict[str, Any]:
    """
    Perform genuine affine quantization from 32-bit floating point to 8-bit integers.
    Measures reconstruction error (MSE), quantization noise, and memory compression.
    """
    np.random.seed(seed)
    if tensor_data is None:
        # Generate representative bell-curve weights with tail outliers
        raw_fp32 = np.random.normal(loc=0.0, scale=1.0, size=size).astype(np.float32)
    else:
        raw_fp32 = np.array(tensor_data, dtype=np.float32)

    min_val = float(raw_fp32.min())
    max_val = float(raw_fp32.max())

    if symmetric:
        # Symmetric INT8 [-127, 127]
        max_abs = max(abs(min_val), abs(max_val))
        scale = max_abs / 127.0 if max_abs > 1e-9 else 1.0
        zero_point = 0
        q_min, q_max = -127, 127
    else:
        # Asymmetric UINT8 [0, 255]
        scale = (max_val - min_val) / 255.0 if (max_val - min_val) > 1e-9 else 1.0
        zero_point = int(np.round(-min_val / scale))
        zero_point = max(0, min(255, zero_point))
        q_min, q_max = 0, 255

    # Quantize
    quantized = np.clip(np.round(raw_fp32 / scale) + zero_point, q_min, q_max).astype(np.int32)

    # Dequantize back to float
    dequantized = scale * (quantized - zero_point)

    # Calculate metrics
    mse = float(np.mean((raw_fp32 - dequantized) ** 2))
    mae = float(np.mean(np.abs(raw_fp32 - dequantized)))
    signal_power = float(np.mean(raw_fp32 ** 2))
    snr_db = 10.0 * np.log10(signal_power / max(1e-12, mse)) if mse > 0 else 100.0

    original_memory_bytes = raw_fp32.nbytes # 4 bytes per float
    quantized_memory_bytes = len(raw_fp32) * 1 # 1 byte per int8
    compression_ratio = round(original_memory_bytes / quantized_memory_bytes, 2)

    return {
        "elements_count": len(raw_fp32),
        "quantization_type": "symmetric_int8" if symmetric else "asymmetric_uint8",
        "scale": round(float(scale), 6),
        "zero_point": int(zero_point),
        "reconstruction_metrics": {
            "mean_squared_error": round(mse, 6),
            "mean_absolute_error": round(mae, 6),
            "signal_to_noise_ratio_db": round(snr_db, 2)
        },
        "memory_savings": {
            "original_fp32_bytes": original_memory_bytes,
            "quantized_int8_bytes": quantized_memory_bytes,
            "compression_ratio": f"{compression_ratio}x (75% savings)"
        },
        "sample_comparison": [
            {"fp32": round(float(f), 4), "int8": int(q), "dequant": round(float(d), 4)}
            for f, q, d in zip(raw_fp32[:8], quantized[:8], dequantized[:8])
        ]
    }
