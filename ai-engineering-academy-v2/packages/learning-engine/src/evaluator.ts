import { MasterChallenge, ChallengeAttempt } from "@academy/shared-types";

export interface EvaluationResult {
  passed: boolean;
  score: number;
  total_criteria: number;
  passed_criteria: number;
  details: {
    metric: string;
    operator: string;
    target: number;
    actual: number;
    passed: boolean;
  }[];
  xp_awarded: number;
  feedback: string;
}

export function evaluateChallengeAttempt(
  challenge: MasterChallenge,
  attemptMetrics: Record<string, number>
): EvaluationResult {
  const details = challenge.success_criteria.map((criterion) => {
    const actual = attemptMetrics[criterion.metric_name] ?? 0;
    let passed = false;

    if (criterion.operator === ">=") {
      passed = actual >= criterion.target_value;
    } else if (criterion.operator === "<=") {
      passed = actual <= criterion.target_value;
    } else if (criterion.operator === "==") {
      passed = actual === criterion.target_value;
    }

    return {
      metric: criterion.metric_name,
      operator: criterion.operator,
      target: criterion.target_value,
      actual,
      passed,
    };
  });

  const passedCount = details.filter((d) => d.passed).length;
  const allPassed = passedCount === challenge.success_criteria.length;
  const score = Math.round((passedCount / challenge.success_criteria.length) * 100);

  return {
    passed: allPassed,
    score,
    total_criteria: challenge.success_criteria.length,
    passed_criteria: passedCount,
    details,
    xp_awarded: allPassed ? challenge.xp_reward : 0,
    feedback: allPassed
      ? `Чудово! Всі ${challenge.success_criteria.length} інженерних критеріїв успішно виконано. Вам нараховано +${challenge.xp_reward} XP.`
      : `Виконано ${passedCount} із ${challenge.success_criteria.length} критеріїв. Перевірте невідповідні метрики та вдоскональте рішення.`,
  };
}
