import numpy as np
from scipy import stats
from typing import Any, Dict, List

def detect_data_drift_ks_test(
    reference_data: List[float],
    current_data: List[float],
    significance_level: float = 0.05
) -> Dict[str, Any]:
    """
    Detect dataset feature drift using the two-sample Kolmogorov-Smirnov (KS) test.
    H0: both samples come from the same continuous distribution.
    """
    ref = np.array(reference_data, dtype=float)
    curr = np.array(current_data, dtype=float)

    ks_stat, p_value = stats.ks_2samp(ref, curr)
    drift_detected = bool(p_value < significance_level)

    # Compute quantiles for visualization
    quantiles = [0.1, 0.25, 0.5, 0.75, 0.9]
    ref_quantiles = np.quantile(ref, quantiles).tolist()
    curr_quantiles = np.quantile(curr, quantiles).tolist()

    return {
        "test_name": "Kolmogorov-Smirnov 2-sample test",
        "ks_statistic": round(float(ks_stat), 4),
        "p_value": round(float(p_value), 6),
        "significance_threshold": significance_level,
        "drift_detected": drift_detected,
        "status": "DRIFT_ALERT" if drift_detected else "STABLE",
        "reference_summary": {
            "mean": round(float(np.mean(ref)), 4),
            "std": round(float(np.std(ref)), 4),
            "quantiles": [round(q, 4) for q in ref_quantiles]
        },
        "current_summary": {
            "mean": round(float(np.mean(curr)), 4),
            "std": round(float(np.std(curr)), 4),
            "quantiles": [round(q, 4) for q in curr_quantiles]
        }
    }

def profile_model_serving_slo(
    concurrency_levels: List[int] = [1, 5, 10, 20],
    base_latency_ms: float = 24.0,
    seed: int = 42
) -> Dict[str, Any]:
    """
    Simulate realistic model-serving load profiles to determine p50, p95, p99 latency SLAs.
    """
    np.random.seed(seed)
    benchmark_results = []

    for c in concurrency_levels:
        # Simulate log-normal latency distribution with queuing delay
        queue_delay = (c ** 1.3) * 1.8
        latencies = np.random.lognormal(mean=np.log(base_latency_ms + queue_delay), sigma=0.25, size=200)

        p50 = float(np.percentile(latencies, 50))
        p95 = float(np.percentile(latencies, 95))
        p99 = float(np.percentile(latencies, 99))
        throughput_rps = (c * 1000.0) / np.mean(latencies)

        benchmark_results.append({
            "concurrency": c,
            "throughput_req_per_sec": round(throughput_rps, 1),
            "latency_p50_ms": round(p50, 2),
            "latency_p95_ms": round(p95, 2),
            "latency_p99_ms": round(p99, 2),
            "slo_met_500ms": bool(p95 < 500.0)
        })

    return {
        "base_inference_latency_ms": base_latency_ms,
        "benchmark_runs": benchmark_results,
        "max_recommended_concurrency": next((r["concurrency"] for r in reversed(benchmark_results) if r["slo_met_500ms"]), 1)
    }
