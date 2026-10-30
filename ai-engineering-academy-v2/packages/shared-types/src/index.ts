// Shared TypeScript Interfaces for AI Engineering Academy 2.0

export type UserRole = "student" | "engineer" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  career_goal: CareerGoal;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export type CareerGoal =
  | "ai_engineer"
  | "ml_engineer"
  | "llm_engineer"
  | "ai_research"
  | "ai_integrator"
  | "free_learning";

export interface CareerPath {
  id: string;
  code: CareerGoal;
  title: string;
  description: string;
  icon: string;
  track_ids: string[];
  recommended_order: string[];
}

export interface Skill {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  level: 1 | 2 | 3 | 4 | 5;
  prerequisite_ids: string[];
  track_id: string;
  verification_method: "deterministic_test" | "benchmark" | "evaluation_suite";
}

export interface UserSkillProgress {
  user_id: string;
  skill_id: string;
  status: "locked" | "available" | "in_progress" | "verified";
  verified_at?: string;
  score?: number;
  evidence_attempt_id?: string;
}

// 20 Educational Tracks
export interface Track {
  id: string;
  number: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "foundations" | "core_ml" | "deep_learning" | "llm_genai" | "engineering_ops";
  estimated_hours: number;
  skills_covered: string[];
  icon: string;
}

// 3 Core Learning Mechanics: Discover, Create, Master
export type LearningMode = "discover" | "create" | "master";

export interface DiscoverStep {
  step_number: number;
  title: string;
  explanation: string;
  interactive_type:
    | "parameter_slider"
    | "decision_boundary_2d"
    | "loss_landscape_3d"
    | "neuron_activation_explorer"
    | "token_highlighter"
    | "attention_heatmap"
    | "embedding_projector"
    | "rag_chunk_visualizer"
    | "prompt_template_diff";
  initial_state: Record<string, any>;
  target_goal?: string;
  expected_outcome_explanation: string;
  check_question?: {
    question: string;
    options: string[];
    correct_option_index: number;
    explanation: string;
  };
}

export interface DiscoverLesson {
  id: string;
  track_id: string;
  title: string;
  slug: string;
  concept_summary: string;
  steps: DiscoverStep[];
  code_explanation: CodeExplanation;
}

// "Подивитися, як це працює" (See How It Works)
export interface CodeExplanation {
  algorithm_name: string;
  mathematical_intuition: string;
  library_used: string;
  library_version: string;
  actual_config: Record<string, any>;
  python_code: string;
  javascript_code?: string;
  sample_inputs: Record<string, any>;
  sample_outputs: Record<string, any>;
  curl_request: string;
  reproducible_script: string;
}

// Create Mode: Step-by-Step AI System Builder
export type AIProjectType = "companion" | "model" | "product";

export interface AIProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  project_type: AIProjectType;
  evolution_level: number;
  version: string;
  active_model_id?: string;
  attached_skills: string[];
  configuration: Record<string, any>;
  metrics: Record<string, number>;
  status: "draft" | "trained" | "evaluated" | "deployed";
  created_at: string;
  updated_at: string;
}

export interface CreateBuilderStep {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  step_name:
    | "choose_task"
    | "prepare_data"
    | "configure_model"
    | "train_model"
    | "test_and_analyze"
    | "improve_hyperparameters"
    | "save_and_deploy";
  title: string;
  description: string;
  ui_component: string;
  config_schema: Record<string, any>;
}

// Master Mode: Engineering Challenge
export interface MasterChallenge {
  id: string;
  track_id: string;
  title: string;
  difficulty: "junior" | "middle" | "senior";
  problem_statement: string;
  bug_symptom: string;
  broken_state_config: Record<string, any>;
  hidden_benchmark_dataset_id: string;
  success_criteria: {
    metric_name: string;
    operator: ">=" | "<=" | "==";
    target_value: number;
  }[];
  xp_reward: number;
}

export interface ChallengeAttempt {
  id: string;
  challenge_id: string;
  user_id: string;
  submitted_config: Record<string, any>;
  status: "passed" | "failed" | "evaluating";
  actual_metrics: Record<string, number>;
  execution_logs: string[];
  passed_tests: number;
  total_tests: number;
  created_at: string;
}

// Evaluation Engine
export interface EvaluationRun {
  id: string;
  task_id: string;
  user_id: string;
  model_id?: string;
  dataset_id: string;
  metrics: Record<string, number>;
  passed: boolean;
  deterministic_hash: string;
  errors?: string[];
  execution_time_ms: number;
  timestamp: string;
}

// Portfolio & Achievements
export interface PortfolioItem {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  summary: string;
  skills_demonstrated: string[];
  verified_metrics: Record<string, number>;
  public_url: string;
  interactive_demo_config: Record<string, any>;
  created_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  xp_points: number;
  unlocked_at?: string;
}

// Compute Dispatcher & Workers
export type ComputeTarget = "browser_wasm" | "browser_webgpu" | "server_cpu" | "server_gpu";

export interface ComputeJobRequest {
  job_id: string;
  job_type: "ml_train" | "fine_tune" | "rag_embed" | "inference" | "eval";
  track_slug: string;
  preferred_target: ComputeTarget;
  parameters: Record<string, any>;
  dataset_ref?: string;
}

export interface ComputeJobResult {
  job_id: string;
  success: boolean;
  target_used: ComputeTarget;
  metrics: Record<string, number>;
  artifacts: Record<string, any>;
  execution_time_sec: number;
  error?: string;
}
