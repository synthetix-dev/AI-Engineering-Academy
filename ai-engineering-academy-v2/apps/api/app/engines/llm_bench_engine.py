from typing import Any, Dict

def profile_llm_inference_memory(
    parameter_count_b: float = 7.0, # e.g. 7B
    precision_bits: int = 16, # 16 (FP16), 8 (INT8), 4 (INT4)
    context_tokens: int = 4096,
    batch_size: int = 4,
    num_layers: int = 32,
    num_kv_heads: int = 32,
    head_dim: int = 128
) -> Dict[str, Any]:
    """
    Accurately compute LLM serving memory footprint and throughput limits.
    Weights + KV Cache + Activation Memory.
    """
    bytes_per_param = precision_bits / 8.0

    # 1. Static weights memory in GB
    weights_gb = (parameter_count_b * 1e9 * bytes_per_param) / (1024 ** 3)

    # 2. KV Cache memory:
    # 2 (K and V) * num_layers * num_kv_heads * head_dim * context_tokens * batch_size * bytes_per_elem
    # KV cache is typically stored in FP16 (2 bytes) unless quantized
    kv_bytes_per_elem = 2.0
    kv_cache_bytes = 2 * num_layers * num_kv_heads * head_dim * context_tokens * batch_size * kv_bytes_per_elem
    kv_cache_gb = kv_cache_bytes / (1024 ** 3)

    # 3. Activation overhead (estimated ~15% of static weights during forward pass)
    activation_gb = weights_gb * 0.15

    # 4. Total minimum VRAM required
    total_vram_gb = weights_gb + kv_cache_gb + activation_gb

    # 5. Theoretical memory bandwidth bound tokens/sec (assuming 800 GB/s A100 or 150 GB/s Apple M-series unified memory)
    bandwidth_gb_s = 400.0 # moderate unified / PCIe bandwidth
    tokens_per_sec_memory_bound = bandwidth_gb_s / max(0.1, weights_gb)

    return {
        "parameters_billion": parameter_count_b,
        "precision": f"INT{precision_bits}" if precision_bits < 16 else "FP16",
        "context_tokens": context_tokens,
        "batch_size": batch_size,
        "memory_breakdown_gb": {
            "model_weights": round(weights_gb, 2),
            "kv_cache": round(kv_cache_gb, 2),
            "activation_overhead": round(activation_gb, 2),
            "total_minimum_vram": round(total_vram_gb, 2)
        },
        "kv_cache_per_token_mb": round((kv_cache_bytes / (context_tokens * batch_size)) / (1024 ** 2), 4),
        "estimated_single_stream_tps": round(tokens_per_sec_memory_bound, 1),
        "supported_on_16gb_system": bool(total_vram_gb <= 14.0)
    }
