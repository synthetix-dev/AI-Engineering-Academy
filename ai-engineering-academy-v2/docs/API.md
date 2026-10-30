# REST API Documentation — AI Engineering Academy 2.0

## 1. Overview
Base URL: `/api/v1`
Interactive Swagger UI: `http://localhost:8000/docs`
OpenAPI JSON Schema: `http://localhost:8000/openapi.json`

## 2. Core Endpoint Groups

### Authentication (`/api/v1/auth`)
- `POST /register`: Register new student or engineer account. Returns JWT access token.
- `POST /login`: Authenticate with email & password. Returns JWT access token.
- `GET /me`: Retrieve profile of currently authenticated user.

### Users & Preferences (`/api/v1/users`)
- `GET /me`: Detailed profile, XP, and current level.
- `PATCH /me`: Update full name, career goal, theme, or code inspection preferences.

### Career Paths (`/api/v1/paths`)
- `GET /`: List all 6 career pathways with priority track sequences.
- `GET /{code}`: Get full syllabus and track sequence for a specific pathway.

### Skill Graph (`/api/v1/skills`)
- `GET /`: List all 20 skills with DAG prerequisites.
- `GET /user-progress`: Retrieve mastery status (`locked`, `available`, `verified`) for current user.

### Curriculum (`/api/v1/curriculum`)
- `GET /tracks`: Full catalog of all 20 educational tracks.
- `GET /tracks/{slug}`: Track metadata, category, and estimated hours.
- `GET /tracks/{slug}/discover`: Interactive Discover lesson with steps, check questions, and "See How It Works" engineering blueprint.

### Master Challenges (`/api/v1/challenges`)
- `GET /`: List engineering challenges across tracks.
- `POST /attempt`: Submit configuration/code fix for a challenge. Runs deterministic evaluation against target criteria and awards XP.

### AI Evolution Projects (`/api/v1/projects`)
- `GET /`: List user's AI projects (Companion, Model, Product).
- `POST /`: Initialize a new persistent AI project.
- `PATCH /{project_id}`: Evolve project version (e.g., `v1.0.0` → `v1.1.0`), attach skills, update configuration.

### Model Registry (`/api/v1/models`)
- `GET /`: List registered models and frameworks.
- `POST /`: Register a new model version or LoRA adapter.

### Datasets (`/api/v1/datasets`)
- `GET /`: List verified dataset manifests, schemas, and sample previews.

### Computational Experiments (`/api/v1/experiments`)
- `POST /run`: Execute real numerical experiment on any of the 20 tracks. Returns runtime metrics, artifacts, and execution time.

### Training Jobs (`/api/v1/training-jobs`)
- `POST /`: Submit asynchronous long-running training job to worker queue.
- `GET /{job_id}`: Poll training job progress and metrics.
- `POST /{job_id}/cancel`: Safely cancel a running job.

### RAG Service (`/api/v1/rag`)
- `POST /collections`: Create knowledge collection.
- `POST /collections/{id}/documents`: Ingest and chunk text with overlap.
- `POST /search`: Execute semantic vector retrieval and context synthesis.

### AI Agents (`/api/v1/agents`)
- `POST /`: Create autonomous agent configuration.
- `POST /run`: Run ReAct tool-calling loop and return step-by-step execution trace.

### Evaluations (`/api/v1/evaluations`)
- `POST /run`: Run deterministic benchmark test against hidden dataset.

### Portfolio & Achievements (`/api/v1/portfolio`)
- `GET /`: Retrieve user's verified portfolio items.
- `POST /`: Publish an AI project to public portfolio.
- `GET /achievements`: List badges with unlock criteria.
- `GET /public/{slug}`: Publicly shareable verified portfolio item for employers.

### Admin Control Plane (`/api/v1/admin`)
- `GET /stats`: System telemetry, queue health, user counts, and compute limits.
