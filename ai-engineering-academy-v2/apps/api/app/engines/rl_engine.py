import math
import numpy as np
from typing import Any, Dict, List

def simulate_multi_armed_bandit(
    arm_probabilities: List[float] = [0.15, 0.35, 0.70, 0.45, 0.20],
    strategy: str = "ucb1", # "epsilon_greedy", "ucb1", "thompson_sampling"
    epsilon: float = 0.1,
    steps: int = 200,
    seed: int = 42
) -> Dict[str, Any]:
    """
    Simulate Multi-Armed Bandit exploration/exploitation algorithms
    with true rewards and cumulative regret analysis.
    """
    np.random.seed(seed)
    n_arms = len(arm_probabilities)
    true_probs = np.array(arm_probabilities)
    optimal_prob = np.max(true_probs)

    counts = np.zeros(n_arms, dtype=int)
    successes = np.zeros(n_arms, dtype=int)
    cumulative_rewards = []
    cumulative_regrets = []
    arm_history = []

    total_reward = 0.0
    total_regret = 0.0

    for t in range(1, steps + 1):
        if strategy == "epsilon_greedy":
            if np.random.rand() < epsilon or t <= n_arms:
                arm = np.random.randint(0, n_arms)
            else:
                empirical_means = successes / np.maximum(1, counts)
                arm = int(np.argmax(empirical_means))

        elif strategy == "ucb1":
            if t <= n_arms:
                arm = t - 1
            else:
                empirical_means = successes / counts
                exploration_bonus = np.sqrt((2.0 * np.log(t)) / counts)
                ucb_values = empirical_means + exploration_bonus
                arm = int(np.argmax(ucb_values))

        elif strategy == "thompson_sampling":
            # Sample from Beta(successes + 1, failures + 1)
            beta_samples = [
                np.random.beta(successes[i] + 1, (counts[i] - successes[i]) + 1)
                for i in range(n_arms)
            ]
            arm = int(np.argmax(beta_samples))
        else:
            arm = np.random.randint(0, n_arms)

        # Pull arm and observe binary reward
        reward = 1 if np.random.rand() < true_probs[arm] else 0
        counts[arm] += 1
        successes[arm] += reward
        total_reward += reward

        # Regret is the difference between optimal expected reward and chosen arm expected reward
        regret = optimal_prob - true_probs[arm]
        total_regret += regret

        cumulative_rewards.append(total_reward)
        cumulative_regrets.append(round(total_regret, 4))
        arm_history.append(arm)

    empirical_p = successes / np.maximum(1, counts)

    return {
        "strategy": strategy,
        "steps": steps,
        "total_reward": total_reward,
        "total_regret": round(total_regret, 4),
        "optimal_arm_index": int(np.argmax(true_probs)),
        "arm_pull_counts": counts.tolist(),
        "empirical_probabilities": [round(float(p), 4) for p in empirical_p],
        "true_probabilities": arm_probabilities,
        "cumulative_regret_progression": cumulative_regrets[::max(1, steps // 20)]
    }

def calculate_dpo_loss(
    pairs: List[Dict[str, float]], # [{"logp_pi_w": -2.1, "logp_ref_w": -2.3, "logp_pi_l": -3.5, "logp_ref_l": -2.8}]
    beta: float = 0.1
) -> Dict[str, Any]:
    """
    Compute Direct Preference Optimization (DPO) loss:
    L_DPO = -log sigmoid( beta * (log(pi(yw)/ref(yw)) - log(pi(yl)/ref(yl))) )
    """
    losses = []
    rewards_chosen = []
    rewards_rejected = []

    for item in pairs:
        pi_w = item.get("logp_pi_w", -1.0)
        ref_w = item.get("logp_ref_w", -1.0)
        pi_l = item.get("logp_pi_l", -2.0)
        ref_l = item.get("logp_ref_l", -1.5)

        log_ratio_w = pi_w - ref_w
        log_ratio_l = pi_l - ref_l

        diff = beta * (log_ratio_w - log_ratio_l)
        # Numerically stable sigmoid: 1 / (1 + exp(-diff))
        sigm = 1.0 / (1.0 + math.exp(-max(-30.0, min(30.0, diff))))
        loss = -math.log(max(1e-12, sigm))

        losses.append(loss)
        rewards_chosen.append(round(beta * log_ratio_w, 4))
        rewards_rejected.append(round(beta * log_ratio_l, 4))

    mean_loss = float(np.mean(losses)) if losses else 0.0

    return {
        "beta": beta,
        "pairs_evaluated": len(pairs),
        "mean_dpo_loss": round(mean_loss, 4),
        "implicit_rewards": {
            "chosen_avg": round(float(np.mean(rewards_chosen)), 4) if rewards_chosen else 0.0,
            "rejected_avg": round(float(np.mean(rewards_rejected)), 4) if rewards_rejected else 0.0,
            "margin": round(float(np.mean(rewards_chosen) - np.mean(rewards_rejected)), 4) if rewards_chosen else 0.0
        }
    }
