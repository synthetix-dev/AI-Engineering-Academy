import math
import numpy as np
from typing import Any, Dict, List

def compute_attention_scores(
    query_vectors: List[List[float]],
    key_vectors: List[List[float]],
    value_vectors: List[List[float]],
    causal_mask: bool = True
) -> Dict[str, Any]:
    """
    Compute real Scaled Dot-Product Attention:
    Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k) + M) * V
    """
    Q = np.array(query_vectors, dtype=float)
    K = np.array(key_vectors, dtype=float)
    V = np.array(value_vectors, dtype=float)

    seq_len, d_k = Q.shape
    if K.shape != (seq_len, d_k) or V.shape[0] != seq_len:
        return {"error": f"Dimension mismatch: Q={Q.shape}, K={K.shape}, V={V.shape}"}

    # 1. Raw dot-product scores: (seq_len, seq_len)
    scores = np.dot(Q, K.T) / math.sqrt(d_k)

    # 2. Causal masking (set upper triangle to -infinity)
    if causal_mask:
        mask = np.triu(np.ones((seq_len, seq_len), dtype=bool), k=1)
        scores[mask] = -1e9

    # 3. Stable softmax along last axis
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    attention_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)

    # 4. Multiply by Value matrix
    context = np.dot(attention_weights, V)

    return {
        "sequence_length": seq_len,
        "head_dimension": d_k,
        "attention_weights_matrix": np.round(attention_weights, 4).tolist(),
        "context_vectors": np.round(context, 4).tolist()
    }

def sample_next_token(
    logits: List[float],
    temperature: float = 1.0,
    top_k: int = 0,
    top_p: float = 1.0,
    seed: int = 42
) -> Dict[str, Any]:
    """
    Perform stochastic next-token sampling with temperature, top-k, and nucleus top-p filtering.
    """
    np.random.seed(seed)
    logits_arr = np.array(logits, dtype=float)

    # 1. Temperature scaling
    temp = max(1e-4, temperature)
    scaled_logits = logits_arr / temp

    # 2. Top-K filtering
    if top_k > 0 and top_k < len(scaled_logits):
        kth_val = np.partition(scaled_logits, -top_k)[-top_k]
        scaled_logits[scaled_logits < kth_val] = -1e9

    # 3. Softmax probabilities
    exp_l = np.exp(scaled_logits - np.max(scaled_logits))
    probs = exp_l / np.sum(exp_l)

    # 4. Top-P (nucleus) filtering
    if top_p < 1.0:
        sorted_indices = np.argsort(probs)[::-1]
        cumulative_probs = np.cumsum(probs[sorted_indices])
        remove_indices = sorted_indices[cumulative_probs > top_p]
        # Keep at least the top-1 token
        if len(remove_indices) == len(probs):
            remove_indices = remove_indices[1:]
        probs[remove_indices] = 0.0
        prob_sum = np.sum(probs)
        if prob_sum > 0:
            probs = probs / prob_sum

    # 5. Sample token index
    sampled_idx = int(np.random.choice(len(probs), p=probs))

    return {
        "sampled_token_index": sampled_idx,
        "sampled_token_probability": round(float(probs[sampled_idx]), 4),
        "filtered_probabilities": [round(float(p), 4) for p in probs]
    }
