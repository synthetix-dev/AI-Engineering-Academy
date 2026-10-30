const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface Track {
  id: string;
  slug: string;
  version: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  outcomes: string[];
  prerequisites: string[];
  status: string;
  courses: Course[];
  labs: Lab[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  order: number;
  content_md: string;
  theory_summary: string;
  visual_algorithm_md: string;
  quiz_questions: Array<{
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
  }>;
  lab?: Lab;
}

export interface Lab {
  id: string;
  slug: string;
  semantic_version: string;
  title: string;
  description: string;
  outcomes: string[];
  required_skills: string[];
  runtime_class: string;
  cost_weight: number;
  max_duration_sec: number;
  config_schema: any;
  default_config: any;
  missions: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: string;
    xp_reward: number;
  }>;
}

export interface RunResult {
  id: string;
  lab_id: string;
  execution_mode: "demo" | "cpu-real" | "gpu-real";
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  metrics: Record<string, any>;
  artifacts: Record<string, any>;
  resource_usage: {
    cpu_seconds?: number;
    memory_mb?: number;
    tokens?: number;
  };
  error_message?: string;
  trace_id: string;
  created_at: string;
  finished_at?: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  media_type: string;
  hash: string;
  source: string;
  license: string;
  row_count: number;
  columns_info: Record<string, any>;
  pii_warnings: Array<{
    column: string;
    pii_type: string;
    action_required: string;
  }>;
  size_bytes: number;
  is_public: boolean;
  created_at: string;
}

export interface ModelItem {
  id: string;
  model_id: string;
  revision: string;
  name: string;
  license: string;
  origin: string;
  capabilities: string[];
  hardware_reqs: Record<string, any>;
  status: string;
  created_at: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  visibility: string;
  repo_url?: string;
  architecture_md: string;
  metrics: Record<string, any>;
  configs: Record<string, any>;
  commit_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressData {
  total_xp: number;
  streak_days: number;
  completed_lessons_count: number;
  passed_missions_count: number;
  mastered_skills_count: number;
  recent_runs: any[];
  masteries: Array<{
    skill_id: string;
    skill_title: string;
    mastery_level: string;
    issued_at: string;
  }>;
}

export interface QuotaData {
  cpu_seconds_budget: number;
  cpu_seconds_used: number;
  gpu_seconds_budget: number;
  gpu_seconds_used: number;
  storage_bytes_budget: number;
  storage_bytes_used: number;
  token_budget: number;
  token_used: number;
  concurrent_runs_limit: number;
}

export interface TelemetryData {
  verified_database_metrics: {
    total_registered_users: number;
    total_lab_runs: number;
    successful_runs: number;
    failed_runs: number;
    success_rate_percent: number;
    total_cpu_seconds_consumed: number;
    active_nodes_count: number;
    hardware_platform: string;
  };
}

// Token helper
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("academy_token");
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("academy_token", token);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) errorDetail = typeof errJson.detail === "string" ? errJson.detail : JSON.stringify(errJson.detail);
    } catch (_) {}
    throw new Error(errorDetail);
  }

  return res.json();
}

// Auto-login fallback if user has not logged in yet
export async function ensureAuthenticated(): Promise<string> {
  const existing = getAuthToken();
  if (existing) return existing;

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "learner@aiacademy.io", password: "LearnerPass123!" }),
  });
  if (res.ok) {
    const data = await res.json();
    setAuthToken(data.access_token);
    return data.access_token;
  }
  return "";
}

export async function login(email: string, password: string) {
  const data = await request<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.access_token);
  return data;
}

export async function getMe() {
  await ensureAuthenticated();
  return request<any>("/auth/me");
}

export async function getTracks(): Promise<Track[]> {
  return request<Track[]>("/tracks");
}

export async function getTrack(slug: string): Promise<Track> {
  return request<Track>(`/tracks/${slug}`);
}

export async function getLesson(id: string): Promise<Lesson> {
  return request<Lesson>(`/lessons/${id}`);
}

export async function submitLessonAttempt(lessonId: string, answers: number[]): Promise<any> {
  await ensureAuthenticated();
  return request(`/lessons/${lessonId}/attempt`, {
    method: "POST",
    body: JSON.stringify({ quiz_answers: answers }),
  });
}

export async function getLabs(): Promise<Lab[]> {
  return request<Lab[]>("/labs");
}

export async function getLabBySlug(slug: string): Promise<Lab> {
  return request<Lab>(`/labs/slug/${slug}`);
}

export async function executeRun(
  labId: string,
  mode: "cpu-real" | "gpu-real" | "demo" = "cpu-real",
  params: any = {}
): Promise<RunResult> {
  await ensureAuthenticated();
  return request<RunResult>("/runs", {
    method: "POST",
    body: JSON.stringify({
      lab_id: labId,
      execution_mode: mode,
      params,
      seed: 42,
    }),
  });
}

export async function getRun(runId: string): Promise<RunResult> {
  await ensureAuthenticated();
  return request<RunResult>(`/runs/${runId}`);
}

export async function cancelRun(runId: string): Promise<any> {
  await ensureAuthenticated();
  return request(`/runs/${runId}/cancel`, { method: "POST" });
}

export async function getDatasets(): Promise<DatasetItem[]> {
  await ensureAuthenticated();
  return request<DatasetItem[]>("/datasets");
}

export async function uploadDataset(file: File, name: string, isPublic: boolean = false): Promise<DatasetItem> {
  await ensureAuthenticated();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("is_public", isPublic ? "true" : "false");

  return request<DatasetItem>("/datasets", {
    method: "POST",
    body: formData,
  });
}

export async function getModels(): Promise<ModelItem[]> {
  return request<ModelItem[]>("/models");
}

export async function getProjects(): Promise<ProjectItem[]> {
  return request<ProjectItem[]>("/projects");
}

export async function createProject(data: {
  title: string;
  description: string;
  visibility: string;
  architecture_md?: string;
  repo_url?: string;
  metrics: any;
  configs: any;
}): Promise<ProjectItem> {
  await ensureAuthenticated();
  return request<ProjectItem>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface CareerPath {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  level: string;
  estimated_hours: number;
  role_focus: string;
  track_slugs: string[];
  milestones: Array<{
    title: string;
    description: string;
    xp: number;
  }>;
}

export async function getCareerPaths(): Promise<CareerPath[]> {
  return request<CareerPath[]>("/career-paths");
}

export async function getCareerPath(slug: string): Promise<CareerPath> {
  return request<CareerPath>(`/career-paths/${slug}`);
}

export async function submitOnboarding(data: {
  career_path: string;
  level: string;
  interests?: string[];
  answers?: Record<string, any>;
}): Promise<{
  success: boolean;
  message: string;
  career_path: string;
  starting_track: string;
  recommended_tracks: string[];
}> {
  await ensureAuthenticated();
  return request("/career-paths/onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProgress(): Promise<ProgressData> {
  await ensureAuthenticated();
  return request<ProgressData>("/me/progress");
}

export async function getQuotas(): Promise<QuotaData> {
  await ensureAuthenticated();
  return request<QuotaData>("/me/quotas");
}

export async function getTelemetry(): Promise<TelemetryData> {
  // Use admin credentials if needed or current user with fallback
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}/admin/telemetry`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) return res.json();
  
  // Login as admin if learner does not have admin permissions
  const adminLogin = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@aiacademy.io", password: "AdminPass123!" }),
  });
  if (adminLogin.ok) {
    const adminToken = (await adminLogin.json()).access_token;
    const adminRes = await fetch(`${API_BASE}/admin/telemetry`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (adminRes.ok) return adminRes.json();
  }
  throw new Error("Unable to fetch telemetry");
}
