# Technical Architecture — AI Engineering Academy 2.0

## 1. High-Level Architectural Vision

AI Engineering Academy 2.0 operates on a **Browser-First + Server-Assisted + Asynchronous Training** architecture.
The primary engineering objective is minimal server operational overhead without sacrificing genuine numerical, machine learning, and deep learning computations.

```
+-----------------------------------------------------------------------------------+
|                             Next.js 14 Web Frontend                              |
|   (Onboarding, 20-Track Studios, Discover/Create/Master, Personal Cabinet, Visuals)|
+-----------------------------------------------------------------------------------+
             |                                              |
      [Browser Compute]                             [API Client / HTTP]
             |                                              |
             v                                              v
+-------------------------+             +-------------------------------------------+
|    Browser ML Engine    |             |       FastAPI Modular Monolith API        |
|  * Pyodide (WASM/Python)|             |  * Auth & User Sessions                   |
|  * TensorFlow.js (Train)|             |  * Curriculum & Skill Graph Engine        |
|  * Transformers.js (NLP)|             |  * AI Evolution & Project State           |
|  * Web Workers / WebGPU |             |  * Deterministic Evaluation Engine        |
+-------------------------+             +-------------------------------------------+
                                                            |
                                        +-------------------+-------------------+
                                        |                   |                   |
                                        v                   v                   v
                               +-----------------+  +---------------+  +-----------------+
                               | SQLite / pgvec  |  | Valkey/Redis  |  | Compute Workers |
                               | (30 Tables Rel) |  | (Queues & TTL)|  | (CPU/GPU LoRA)  |
                               +-----------------+  +---------------+  +-----------------+
```

## 2. Component Breakdown

### 2.1. Frontend (`apps/web`)
- **Next.js 14 App Router** with TypeScript.
- **Tailwind CSS & Design Tokens** (`#6DA2E4` primary blue, `#EC612F` accent orange, `#EDF5FE` canvas surface, `#0D2238` deep navy, `#D0D7DE` borders).
- **Interactive Visualizers** (`packages/visualizations`):
  - `DecisionBoundaryCanvas`: interactive 2D data point placement & boundary update.
  - `LossLandscapeCanvas`: gradient descent step trajectory & loss visualization.
  - `NeuralNetVisualizer`: multi-layer perceptron architecture and activation signals.
  - `AttentionHeatmap`: self-attention Query x Key weight matrices.
  - `TokenHighlighter`: BPE tokenization chips with numeric IDs.
  - `RAGChunkVisualizer`: document chunking with overlap highlights.
- **"Подивитися, як це працює" (See How It Works)**:
  - Universal technical blueprint drawer displaying the mathematical intuition, official open-source library, actual runtime configuration, executable Python code, sample I/O, cURL snippet, and terminal reproduction script.

### 2.2. Browser ML Engine (`packages/browser-ml`)
- **Pyodide**: In-browser Python environment running NumPy and scikit-learn without server roundtrips.
- **TensorFlow.js**: Interactive in-browser training of compact neural networks with live epoch loss curves.
- **Transformers.js**: Local tokenization and embedding generation.
- **Compute Dispatcher**: Automatically detects client WebAssembly/WebGPU capabilities, falling back transparently to backend workers when required.

### 2.3. Backend Modular Monolith (`apps/api`)
- **FastAPI** with Python 3.11, Pydantic v2 schemas, and asynchronous route handlers.
- **SQLAlchemy 2.0 Async ORM** supporting SQLite and PostgreSQL with `pgvector` vector extension.
- **Domain Modules**:
  1. `auth`: Secure password hashing (bcrypt), JWT tokens, and session management.
  2. `users`: Preferences, career goals, and telemetry.
  3. `paths`: 6 career paths (AI Engineer, ML Engineer, LLM Engineer, AI Research, AI Integrator, Free Learning).
  4. `skills`: Skill Graph with prerequisite DAG and user mastery progress.
  5. `curriculum`: 20 educational tracks with Discover, Create, Master, and technical blueprints.
  6. `challenges`: Engineering bug challenges, broken states, and test validation.
  7. `projects`: AI Evolution (Companion, Model, Product) versioning and skill attachments.
  8. `datasets`: Verified dataset manifests, schemas, and sample records.
  9. `models`: Model registry, framework tags, versions, and LoRA adapters.
  10. `experiments`: Live computational experiments with runtime metric recording.
  11. `training_jobs`: Asynchronous training queues with timeout and cancellation controls.
  12. `rag`: Chunking with overlap, dense vector search, and grounding verification.
  13. `agents`: ReAct tool-calling loops with sandboxed execution.
  14. `evaluations`: Ground truth verification against hidden benchmarks.
  15. `portfolio`: Public shareable credentials and interactive model demonstrations.
  16. `admin`: Telemetry, queue monitoring, resource quotas, and audit events.

### 2.4. Compute Workers & Asynchronous Queues
- Background workers handle heavy tasks (Fine-tuning, multi-step agent simulations, large model evaluations) outside the HTTP request loop.
- Dedicated queues: `Lightweight CPU`, `ML Training`, `RAG Processing`, `Fine-tuning`, `GPU Training`.
- Worker lifecycle states: `queued`, `running`, `completed`, `failed`, `cancelled`, `timeout`.
