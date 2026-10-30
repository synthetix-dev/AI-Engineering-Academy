# АРХІТЕКТУРА СИСТЕМИ
## AI Engineering Academy — System Architecture & Design Specification

### 1. Загальний огляд (System Overview)

Платформа **AI Engineering Academy** побудована як повнофункціональна інтерактивна система для глибокого навчання інженерів штучного інтелекту без використання сторонніх платних API. Усі обчислення, навчання моделей, оцінювання якості промптів, RAG-пошук та виконання агентських ланцюжків здійснюються локально за допомогою відкритого стеку інструментів (PyTorch, scikit-learn, pgvector, transformers, NetworkX, SciPy).

---

### 2. Діаграма C4 Container (Контейнерний рівень)

```mermaid
flowchart TB
    subgraph Client ["Клієнтський рівень (Браузер)"]
        UI["Next.js 14 Web Application\n(React, Tailwind CSS, Lucide Icons)"]
    end

    subgraph Edge ["Мережевий шлюз"]
        Proxy["Reverse Proxy / API Gateway\n(CORS, Rate Limiting, TLS)"]
    end

    subgraph AppServer ["Серверний рівень (Backend)"]
        FastAPI["FastAPI 0.115 Async Application\n(Pydantic V2, SQLAlchemy 2 Async)"]
        AuthModule["JWT Security & RBAC Module"]
        QuotaModule["Resource & Storage Quota Enforcer"]
        RunsDispatcher["Async Job Dispatcher & Queue Manager"]
    end

    subgraph ComputeEngines ["Обчислювальні ядра (Engines)"]
        PyTorchEngine["PyTorch CPU/MPS Engine\n(Neural Nets, LoRA Fine-Tuning)"]
        MLEngine["Scikit-Learn ML Engine\n(Decision Trees, RF, GBDT, Metrics)"]
        RAGEngine["Hybrid RAG Engine\n(Dense pgvector + Sparse BM25 Fusion)"]
        PromptEngine["Prompt Evaluation Engine\n(10-Fixture Regression Suite)"]
        AgentEngine["ReAct Agent Engine\n(Tools Canvas + Human-in-the-Loop)"]
        SandboxEngine["AST Python Sandbox\n(NodeVisitor Code Containment)"]
    end

    subgraph Storage ["Рівень даних та кешу"]
        Postgres[("PostgreSQL 17 + pgvector\n(Users, Courses, Runs, Artifacts, Vectors)")]
        RedisCache[("Redis 8.1\n(Pub/Sub Event Bus, SSE State, Token Blacklist)")]
        DiskStorage[("Isolated Data Storage\n(/app/data_storage: Datasets, Model Weights)")]
    end

    UI -->|HTTPS / WSS / SSE| Proxy
    Proxy -->|REST API / SSE| FastAPI
    FastAPI --> AuthModule
    FastAPI --> QuotaModule
    FastAPI --> RunsDispatcher
    RunsDispatcher --> ComputeEngines
    FastAPI --> Postgres
    FastAPI --> RedisCache
    ComputeEngines --> DiskStorage
    ComputeEngines --> Postgres
    RunsDispatcher -->|Publish Events| RedisCache
    RedisCache -->|SSE Stream| FastAPI
```

---

### 3. Модель даних (Entity Relationship Model)

```mermaid
erDiagram
    USERS ||--o{ RUNS : initiates
    USERS ||--o{ PROJECTS : builds
    USERS ||--o{ USER_MASTERIES : earns
    USERS ||--o{ ACHIEVEMENTS : unlocks
    USERS ||--|| QUOTAS : constrained_by
    TRACKS ||--o{ COURSES : contains
    COURSES ||--o{ LESSONS : contains
    LESSONS ||--o| LABS : exercises_in
    LABS ||--o{ MISSIONS : includes
    LABS ||--o{ RUNS : executed_via
    DATASETS ||--o{ RUNS : consumed_by
    RUNS ||--o{ EVALUATIONS : assessed_in

    USERS {
        uuid id PK
        string email UK
        string full_name
        string role
        string career_goal
        int xp
        int streak_days
    }
    TRACKS {
        uuid id PK
        string slug UK
        string title
        int order
        jsonb prerequisites
    }
    LABS {
        uuid id PK
        string slug UK
        string title
        string runtime_class
        jsonb config_schema
    }
    RUNS {
        uuid id PK
        uuid user_id FK
        uuid lab_id FK
        string status
        jsonb params
        jsonb metrics
        jsonb artifacts
        datetime finished_at
    }
    QUOTAS {
        uuid id PK
        uuid user_id FK
        float cpu_seconds_budget
        float cpu_seconds_used
        int storage_bytes_budget
        int storage_bytes_used
    }
```

---

### 4. Політика безпеки та ізоляція коду (Security & Sandboxing)

1. **Пісочниця виконання Python (AST Sandbox):**
   - Увесь код, що надсилається користувачем для перевірки в завданнях програмування або аналізу даних, парситься за допомогою модуля `ast`.
   - Заборонені вузли AST: `ast.Import`, `ast.ImportFrom`.
   - Заборонені імена та атрибути: будь-які імена або властивості з префіксом `_` (блокування доступу до `__class__`, `__subclasses__`, `__bases__`, `__globals__`).
   - Заборонені вбудовані функції: `open`, `eval`, `exec`, `globals`, `locals`, `getattr`, `setattr`, `compile`.
   - Перехоплення стандартного виводу виконується потокобезпечно через `contextlib.redirect_stdout` в ізольованому контексті виклику.

2. **Захист від вичерпання ресурсів (Resource Quotas & Timeouts):**
   - Кожен користувач має ліміт на час процесора (`cpu_seconds_budget`, стандартно 1200 секунд для вільного рівня).
   - Ліміт пам'яті для збереження датасетів та моделей (`storage_bytes_budget`, стандартно 500 МБ).
   - Жорсткий таймаут виконання будь-якого одиночного запуску лабораторії (`max_duration_sec`, від 30 до 180 секунд).

3. **Мережева ізоляція та секрети:**
   - Сервіси бази даних (PostgreSQL) та брокера повідомлень (Redis) зв'язуються виключно з адресою `127.0.0.1` або працюють всередині ізольованої віртуальної мережі Docker без зовнішніх відкритих портів.
   - Секрети читаються виключно зі змінних середовища або Docker Secrets, не зберігаючись у репозиторії.

---

### 5. Життєвий цикл асинхронного запуску (Execution Lifecycle)

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Користувач (Браузер)
    participant API as FastAPI Server
    participant DB as PostgreSQL
    participant Worker as Background Compute Task
    participant Redis as Redis Pub/Sub
    participant Lab as Engine (PyTorch / ML / RAG)

    Learner->>API: POST /api/v1/runs {lab_slug, params}
    API->>DB: Перевірка Quota (cpu_used < cpu_budget)
    API->>DB: Створення Run (status="QUEUED")
    API->>Worker: Створення фонової задачі (asyncio.create_task)
    API-->>Learner: HTTP 202 Accepted {run_id, status: "QUEUED"}
    
    Learner->>API: GET /api/v1/runs/{id}/stream (SSE)
    API-->>Learner: Підключення до Redis-каналу run:{id}

    Worker->>DB: Оновлення Run (status="RUNNING")
    Worker->>Redis: Publish Event {status: "RUNNING"}
    Redis-->>Learner: SSE: Event {status: "RUNNING"}

    Worker->>Lab: Виконання обчислень з лімітом часу
    Lab-->>Worker: Результати: {metrics, artifacts, execution_time}
    
    Worker->>DB: Запис результатів (status="SUCCEEDED", metrics, artifacts)
    Worker->>DB: Оновлення Quota (cpu_seconds_used += duration)
    Worker->>Redis: Publish Event {status: "SUCCEEDED", metrics}
    Redis-->>Learner: SSE: Event {status: "SUCCEEDED", metrics}
```
