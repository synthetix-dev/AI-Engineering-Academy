import asyncio
import logging
from sqlalchemy import text
from backend.app.core.database import engine, Base, AsyncSessionLocal
from backend.app.core.security import get_password_hash
from backend.app.models import (
    User, UserRole, Quota, Skill, ModelItem, Track, Course, Lesson, Lab, Mission,
    RuntimeClass
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# The 20 Approved Learning Tracks from Section 4 of Technical Specifications
INITIAL_TRACKS = [
    {
        "slug": "foundations",
        "title": "AI & Computing Foundations",
        "description": "Python, Git, Linux, API, алгоритми, оптимізація та основи систем для AI інженерів.",
        "icon": "terminal",
        "order": 1,
        "outcomes": ["Розуміння асинхронного Python", "Робота з API та структурами даних", "Основи SQL для AI"],
        "lab": {
            "slug": "browser-python-sandbox",
            "title": "Python & SQL Computational Sandbox",
            "description": "Безпечне виконання коду, аналіз складності алгоритмів та SQL-запитів.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 0.5,
            "max_duration_sec": 30,
            "default_config": {"code": "def solve():\n    return [x**2 for x in range(10)]\nprint(solve())", "language": "python"}
        }
    },
    {
        "slug": "math-for-ai",
        "title": "Mathematics for AI",
        "description": "Лінійна алгебра, матричні перетворення, диференціювання, градієнтний спуск та ймовірнісний sampling.",
        "icon": "binary",
        "order": 2,
        "outcomes": ["Матричні операції та тензори", "Градієнтні методи оптимізації", "Ймовірнісний розподіл"],
        "lab": {
            "slug": "visual-matrix-gradient-lab",
            "title": "Matrix Calculus & Gradient Optimization Lab",
            "description": "Аналітичний та чисельний розрахунок градієнтів, кроки спуску, 3D поверхня втрат.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 0.8,
            "max_duration_sec": 60,
            "default_config": {"learning_rate": 0.05, "iterations": 50, "loss_function": "quadratic", "initial_point": [4.0, 3.0]}
        }
    },
    {
        "slug": "data-engineering",
        "title": "Data Science / Data Engineering",
        "description": "EDA, Pandas, NumPy, очищення, feature engineering, нормалізація, PII-сканування та валідація якості даних.",
        "icon": "database",
        "order": 3,
        "outcomes": ["Статистичний аналіз датасетів", "Обробка пропущених значень та викидів", "Feature pipeline"],
        "lab": {
            "slug": "data-cleaning-explorer",
            "title": "CSV Explorer & Feature Engineering Lab",
            "description": "Завантаження CSV, автоматичний аудит PII, імпутація пропусків, масштабування числових ознак.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 60,
            "default_config": {"strategy": "mean", "outlier_removal": True, "scaling": "standard"}
        }
    },
    {
        "slug": "classical-ml",
        "title": "Classical Machine Learning",
        "description": "Регресія, класифікація, дерева рішень, ансамблі, кластеризація, k-fold крос-валідація та метрики якості.",
        "icon": "trending-up",
        "order": 4,
        "outcomes": ["Побудова ML-пайплайну", "Оцінка ROC-AUC / Confusion Matrix", "Запобігання data leakage"],
        "lab": {
            "slug": "ml-playground",
            "title": "Classical ML Model Trainer & Evaluator",
            "description": "Реальне тренування моделей scikit-learn, розбиття split train/test, матриця помилок.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 90,
            "default_config": {"algorithm": "random_forest", "test_size": 0.25, "n_estimators": 100, "seed": 42}
        }
    },
    {
        "slug": "deep-learning",
        "title": "Deep Learning",
        "description": "Тензори, autograd, повнозв'язні та згорткові мережі, функції активації, регуляризація, криві навчання на PyTorch.",
        "icon": "cpu",
        "order": 5,
        "outcomes": ["Автоматичне диференціювання в PyTorch", "Тренувальний цикл нейромережі", "Боротьба з overfitting"],
        "lab": {
            "slug": "neural-builder-lab",
            "title": "PyTorch Neural Network Training Lab",
            "description": "Реальне навчання невеликої нейромережі на CPU, візуалізація loss та accuracy по епохах.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.5,
            "max_duration_sec": 120,
            "default_config": {"layers": [16, 8], "learning_rate": 0.01, "epochs": 15, "batch_size": 32, "activation": "relu"}
        }
    },
    {
        "slug": "nlp-speech",
        "title": "NLP & Speech",
        "description": "Токенізація (BPE, WordPiece), векторні ембедінги, косинусна схожість, класифікація тональності та NER.",
        "icon": "message-square",
        "order": 6,
        "outcomes": ["Алгоритми розбиття тексту на токени", "Семантичний пошук через векторні відстані", "Аналіз тексту"],
        "lab": {
            "slug": "nlp-bench",
            "title": "Tokenization & Semantic Embedding Lab",
            "description": "Дослідження словника токенізатора, обчислення векторних відстаней між реченнями, вилучення іменованих сутностей.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 60,
            "default_config": {"tokenizer_type": "bpe", "vocab_size": 256, "similarity_metric": "cosine"}
        }
    },
    {
        "slug": "computer-vision",
        "title": "Computer Vision",
        "description": "Згорткові фільтри (Sobel, Gaussian), аугментація зображень, IoU (Intersection-over-Union) для детекції об'єктів.",
        "icon": "image",
        "order": 7,
        "outcomes": ["Застосування просторових фільтрів", "Аугментаційні конвеєри", "Оцінка метрик детекції"],
        "lab": {
            "slug": "cv-lab",
            "title": "Computer Vision & Spatial Convolutions Lab",
            "description": "Застосування ядер згортки до тестових матриць зображень та точний розрахунок IoU для bounding boxes.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 60,
            "default_config": {"filter_type": "sobel_edge", "kernel_size": 3, "stride": 1}
        }
    },
    {
        "slug": "generative-models",
        "title": "Generative Models & Attention",
        "description": "Механізм Scaled Dot-Product Attention (Q, K, V), каузальні маски, ймовірнісне декодування (Temperature, Top-p).",
        "icon": "sparkles",
        "order": 8,
        "outcomes": ["Розрахунок матриць уваги Attention", "Маскування майбутніх токенів", "Стохастичне генерування"],
        "lab": {
            "slug": "attention-mechanics-lab",
            "title": "Multi-Head Attention & Sampling Lab",
            "description": "Прямий розрахунок матриці уваги Softmax(QK^T / sqrt(d_k)) та дослідження впливу Temperature/Top-p.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.2,
            "max_duration_sec": 60,
            "default_config": {"d_model": 64, "seq_length": 6, "temperature": 0.7, "top_p": 0.9}
        }
    },
    {
        "slug": "llm-engineering",
        "title": "LLM Engineering",
        "description": "Архітектура inference, KV-cache, оцінка пам'яті моделі, квантизація, batching та latency бенчмарки.",
        "icon": "layers",
        "order": 9,
        "outcomes": ["Розрахунок пропускної здатності", "Оптимізація KV-cache", "FP16 vs INT8 vs INT4"],
        "lab": {
            "slug": "llm-inference-bench",
            "title": "LLM Hardware & Latency Profiler",
            "description": "Точний розрахунок вимог до пам'яті (VRAM = Params * Bytes + KV Cache), моделювання throughput.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 60,
            "default_config": {"parameter_count_b": 7.0, "precision_bits": 16, "context_tokens": 4096, "batch_size": 4}
        }
    },
    {
        "slug": "prompt-engineering",
        "title": "Prompt Engineering",
        "description": "Повна реалізація розділу 6 ТЗ: шаблони, few-shot, JSON Schema constraints, 10 категорій тестів та A/B оцінювач.",
        "icon": "file-code",
        "order": 10,
        "outcomes": ["Надійне дотримання JSON Schema", "Захист від prompt injection", "Автоматична валідація відповідей"],
        "lab": {
            "slug": "prompt-lab-evaluator",
            "title": "Prompt Engineering & 10-Case Evaluator Lab",
            "description": "Конструктор System/User промптів, валідація JSON Schema, A/B порівняння та стрес-тест на ін'єкції.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.2,
            "max_duration_sec": 60,
            "default_config": {
                "system_prompt": "You are a structured data extractor. You must respond in valid JSON matching the schema.",
                "user_prompt_template": "Extract customer info from: {{text}}",
                "schema_definition": {"type": "object", "properties": {"name": {"type": "string"}, "age": {"type": "integer"}}, "required": ["name", "age"]}
            }
        }
    },
    {
        "slug": "rag-engineering",
        "title": "Retrieval-Augmented Generation (RAG)",
        "description": "Повна реалізація розділу 8 ТЗ: розбиття документів, чанкінг, BM25 + dense вектори (pgvector), hybrid rerank, citations.",
        "icon": "book-open",
        "order": 11,
        "outcomes": ["Пайплайн парсингу та чанкінгу", "Гібридний пошук BM25 + pgvector", "Оцінка Groundedness цитувань"],
        "lab": {
            "slug": "rag-builder-inspection",
            "title": "RAG Pipeline & Retrieval Grounding Lab",
            "description": "Індексація тексту в pgvector, пошук джерел за косинусною відстанню, екстракція точних цитат відповідей.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.5,
            "max_duration_sec": 90,
            "default_config": {"chunk_size": 128, "chunk_overlap": 20, "retrieval_mode": "hybrid", "top_k": 3}
        }
    },
    {
        "slug": "training-finetuning",
        "title": "Training & Fine-tuning",
        "description": "Повна реалізація розділу 7 ТЗ: реальне CPU-навчання малої моделі, адаптери LoRA, перевірка датасету, checkpoints.",
        "icon": "sliders",
        "order": 12,
        "outcomes": ["Підготовка JSONL пар інструкцій", "Ініціалізація ваг адаптера LoRA", "Оцінка до/після адаптації"],
        "lab": {
            "slug": "cpu-lora-finetuning-lab",
            "title": "Supervised Fine-Tuning & LoRA Engine",
            "description": "Реальний розрахунок градієнтів для низькорангових матриць LoRA (W = W0 + B*A) на навчальному корпусі.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 2.0,
            "max_duration_sec": 120,
            "default_config": {"lora_rank": 4, "lora_alpha": 8, "learning_rate": 0.005, "epochs": 5, "batch_size": 8}
        }
    },
    {
        "slug": "rl-preference",
        "title": "Preference Optimization & RL",
        "description": "Функції винагороди, алгоритми багаторуких бандитів (epsilon-greedy, UCB), Q-learning та розрахунок втрат DPO.",
        "icon": "target",
        "order": 13,
        "outcomes": ["Exploration vs Exploitation баланс", "Формулювання DPO лоссу", "Оптимізація вибору за людськими перевагами"],
        "lab": {
            "slug": "bandit-dpo-lab",
            "title": "Multi-Armed Bandit & DPO Loss Lab",
            "description": "Симуляція вибору стратегій за UCB/Thompson Sampling та розрахунок функції втрат DPO для пар відповідей.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 60,
            "default_config": {"bandit_arms": 5, "epsilon": 0.1, "steps": 200, "dpo_beta": 0.1}
        }
    },
    {
        "slug": "ai-agents",
        "title": "AI Agents & Tool Use",
        "description": "Повна реалізація розділу 8 ТЗ: цикл ReAct, пісочниця інструментів (CRM, mailbox, calendar, inventory), approval gate.",
        "icon": "bot",
        "order": 14,
        "outcomes": ["Створення валідних контрактів інструментів", "Трасування дій агента", "Human-in-the-loop безпека"],
        "lab": {
            "slug": "agent-sandbox-lab",
            "title": "Autonomous Agent & Sandboxed Tools Lab",
            "description": "Виконання плану агента над ізольованими сервісами (CRM, Mailbox) із обов'язковим підтвердженням дій запису.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.5,
            "max_duration_sec": 90,
            "default_config": {"max_steps": 5, "require_approval_for_write": True, "task": "Check inventory and draft customer email"}
        }
    },
    {
        "slug": "automation-integrations",
        "title": "Automation & Integrations",
        "description": "Графи робочих процесів (DAG), умови, трансформації даних, ідемпотентність, retry та тайм-аути.",
        "icon": "workflow",
        "order": 15,
        "outcomes": ["Побудова стійких автоматизацій", "Ідемпотентне виконання вузлів", "Логування кожного переходу"],
        "lab": {
            "slug": "workflow-dag-lab",
            "title": "Workflow Execution Graph & Idempotency Lab",
            "description": "Конструктор та виконавець графу кроків із перевіркою умов, трансформацією JSON та перехопленням помилок.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 60,
            "default_config": {"max_retries": 3, "backoff_factor": 1.5, "nodes_count": 4}
        }
    },
    {
        "slug": "mlops-llmops",
        "title": "MLOps / LLMOps",
        "description": "Реєстр моделей (staged, production, archived), моніторинг затримки, детекція зсуву даних (Data Drift KS-test/PSI).",
        "icon": "server",
        "order": 16,
        "outcomes": ["Версіонування та аудит артефактів моделей", "Статистичні тести на Drift", "SLO моніторинг інференсу"],
        "lab": {
            "slug": "deployment-drift-lab",
            "title": "Model Serving & Data Drift Monitoring Lab",
            "description": "Симуляція навантаження сервісу моделі, збір p95/p99 латентності та виявлення drift через тест Колмогорова-Смірнова.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.2,
            "max_duration_sec": 60,
            "default_config": {"drift_threshold": 0.05, "sample_size": 200, "metric": "ks_test"}
        }
    },
    {
        "slug": "ai-safety",
        "title": "AI Safety & Responsible AI",
        "description": "Захист від prompt injection, витоку PII, jailbreak атак (OWASP Top 10 for LLMs), етичні фільтри.",
        "icon": "shield-check",
        "order": 17,
        "outcomes": ["Детекція атак маніпуляції промптом", "Анонімізація чутливих даних", "Аудит надійності систем"],
        "lab": {
            "slug": "ai-safety-defense-lab",
            "title": "Security Red-Team & Injection Defense Lab",
            "description": "Тестування промптів на вектори атак (delimiter injection, role hijacking, PII exfiltration) з оцінкою захищеності.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 60,
            "default_config": {"strict_mode": True, "detect_pii": True, "block_delimiters": True}
        }
    },
    {
        "slug": "optimization-infra",
        "title": "Optimization / Infra",
        "description": "Квантизація ваг (FP32 -> INT8/FP16), розрахунок економії пам'яті, бенчмарки пропускної здатності та батчингу.",
        "icon": "gauge",
        "order": 18,
        "outcomes": ["Зменшення розміру моделі без втрати якості", "Паралелізація та кешування", "Профілювання обчислень"],
        "lab": {
            "slug": "quantization-bench-lab",
            "title": "Quantization & Memory Footprint Lab",
            "description": "Реальне перетворення тензорів з FP32 в INT8 (scale + zero-point), обчислення похибки відновлення та економії RAM.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 60,
            "default_config": {"tensor_size": 10000, "target_dtype": "int8", "symmetric": False}
        }
    },
    {
        "slug": "research-literacy",
        "title": "Research Literacy",
        "description": "Відтворення результатів наукових статей (Paper Reproduction), абляційні дослідження, статистична значущість (t-test).",
        "icon": "file-text",
        "order": 19,
        "outcomes": ["Аналіз ablation studies", "Розрахунок p-value для гіпотез", "Верифікація reproducibility"],
        "lab": {
            "slug": "ablation-reproduction-lab",
            "title": "Ablation Study & Hypothesis Testing Lab",
            "description": "Порівняння baseline моделі з модифікаціями, розрахунок довірчих інтервалів та p-значення.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 1.0,
            "max_duration_sec": 60,
            "default_config": {"alpha": 0.05, "baseline_runs": 10, "ablation_runs": 10}
        }
    },
    {
        "slug": "ai-product-engineering",
        "title": "AI Product Engineering",
        "description": "Capstone проєкт: повний цикл від проблеми до Model Card, оцінка компромісів вартість/якість, архітектурний захист.",
        "icon": "check-circle",
        "order": 20,
        "outcomes": ["Комплексна побудова AI продукту", "Складання Model Card за стандартами", "Фінальний захист портфоліо"],
        "lab": {
            "slug": "capstone-design-lab",
            "title": "Capstone Solution & Model Card Generator",
            "description": "Формування комплексного паспорту AI-системи: походження даних, метрики, обмеження, ліцензія та план деплою.",
            "runtime_class": RuntimeClass.CPU_WORKER,
            "cost_weight": 2.0,
            "max_duration_sec": 90,
            "default_config": {"generate_model_card": True, "validate_reproducibility": True}
        }
    }
]

INITIAL_MODELS = [
    {
        "model_id": "tinystories-cpu-15m",
        "name": "TinyStories 15M (Open Source Causal LM)",
        "revision": "v1.0",
        "license": "Apache-2.0",
        "origin": "Hugging Face / Ronen Eldan & Yuanzhi Li",
        "capabilities": ["text-generation", "instruction-following", "causal-lm"],
        "hardware_reqs": {"min_ram_mb": 512, "recommended_cpu_cores": 2, "supports_cpu_real": True}
    },
    {
        "model_id": "minilm-embeddings-384",
        "name": "All-MiniLM-L6-v2 (Embedding Retriever)",
        "revision": "v2.0",
        "license": "Apache-2.0",
        "origin": "Sentence-Transformers",
        "capabilities": ["dense-embeddings", "semantic-search", "rag"],
        "hardware_reqs": {"min_ram_mb": 256, "recommended_cpu_cores": 1, "supports_cpu_real": True}
    },
    {
        "model_id": "distilbert-base-ner",
        "name": "DistilBERT Token Classifier (NER)",
        "revision": "v1.0",
        "license": "Apache-2.0",
        "origin": "Hugging Face / DistilBERT team",
        "capabilities": ["named-entity-recognition", "token-classification"],
        "hardware_reqs": {"min_ram_mb": 512, "recommended_cpu_cores": 2, "supports_cpu_real": True}
    },
    {
        "model_id": "scikit-ensemble-tabular",
        "name": "Scikit-Learn Gradient Boosted Regressor & Classifier",
        "revision": "1.4.0",
        "license": "BSD-3-Clause",
        "origin": "scikit-learn open source community",
        "capabilities": ["tabular-classification", "regression", "cross-validation"],
        "hardware_reqs": {"min_ram_mb": 256, "recommended_cpu_cores": 1, "supports_cpu_real": True}
    }
]

INITIAL_SKILLS = [
    {"id": "python_basics", "title": "Python & Async Systems", "category": "Foundations", "description": "Впевнене володіння структурами даних, генераторами та асинхронністю в Python."},
    {"id": "matrix_calculus", "title": "Matrix Operations & Autograd", "category": "Mathematics", "description": "Розрахунок матричних множень, тензорних операцій та аналітичних градієнтів."},
    {"id": "feature_engineering", "title": "Data Preprocessing & Scaling", "category": "Data Engineering", "description": "Очищення даних, PII перевірка, нормалізація числових та категоріальних колонок."},
    {"id": "scikit_pipeline", "title": "Classical ML & Cross-Validation", "category": "Machine Learning", "description": "Побудова reproducible конвеєрів навчання, розрахунок ROC-AUC та Confusion Matrix."},
    {"id": "pytorch_nn", "title": "PyTorch Neural Architectures", "category": "Deep Learning", "description": "Створення класів nn.Module, оптимізація loss функцій та бекпропагейшн."},
    {"id": "token_attention", "title": "Transformer Attention Mechanics", "category": "Generative Models", "description": "Матричний розрахунок Attention Scores та розуміння механізмів маскування."},
    {"id": "prompt_defense", "title": "Robust Prompting & Schema Guardrails", "category": "Prompt Engineering", "description": "Конструювання детермінованих JSON-промптів та захист від instruction injection."},
    {"id": "rag_hybrid", "title": "Dense & Lexical Hybrid RAG", "category": "RAG", "description": "Розгортання векторного пошуку pgvector у поєднанні з BM25 та groundedness перевірками."},
    {"id": "lora_peft", "title": "Parameter-Efficient Fine-Tuning (LoRA)", "category": "Fine-Tuning", "description": "Навчання низькорангових матриць адаптації для трансформерів без перезапису базових ваг."},
    {"id": "agent_react", "title": "Autonomous Tool Planning & Safety", "category": "Agents", "description": "Створення агентів зі строгими контрактами інструментів та ручним підтвердженням небезпечних операцій."}
]

async def init_database():
    """Create all tables and seed initial records."""
    logger.info("Connecting to database and verifying pgvector extension...")
    async with engine.begin() as conn:
        # Enable pgvector extension inside the transaction
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        logger.info("Creating all relational database tables...")
        await conn.run_sync(Base.metadata.create_all)
        logger.info("All tables successfully verified/created!")

    async with AsyncSessionLocal() as session:
        # Check if users already exist
        result = await session.execute(text("SELECT COUNT(*) FROM users;"))
        users_count = result.scalar()
        
        if users_count == 0:
            logger.info("Seeding initial users and administrative accounts...")
            admin_user = User(
                email="admin@aiacademy.io",
                password_hash=get_password_hash("AdminPass123!"),
                full_name="Platform Administrator",
                role=UserRole.PLATFORM_ADMIN,
                locale="uk",
                status="active",
                is_active=True,
                xp=1000
            )
            learner_user = User(
                email="learner@aiacademy.io",
                password_hash=get_password_hash("LearnerPass123!"),
                full_name="Active AI Learner",
                role=UserRole.LEARNER,
                locale="uk",
                status="active",
                is_active=True,
                xp=150
            )
            session.add_all([admin_user, learner_user])
            await session.flush()

            # Create quotas
            admin_quota = Quota(
                user_id=admin_user.id,
                cpu_seconds_budget=36000.0,
                gpu_seconds_budget=7200.0,
                token_budget=1000000,
                concurrent_runs_limit=10
            )
            learner_quota = Quota(
                user_id=learner_user.id,
                cpu_seconds_budget=3600.0,
                gpu_seconds_budget=600.0,
                token_budget=100000,
                concurrent_runs_limit=3
            )
            session.add_all([admin_quota, learner_quota])
            logger.info("Admin and Learner accounts created.")

        # Seed Skills
        skill_res = await session.execute(text("SELECT COUNT(*) FROM skills;"))
        if skill_res.scalar() == 0:
            logger.info("Seeding initial skills graph...")
            for s in INITIAL_SKILLS:
                skill_obj = Skill(
                    id=s["id"],
                    title=s["title"],
                    category=s["category"],
                    description=s["description"]
                )
                session.add(skill_obj)

        # Seed Approved Models
        model_res = await session.execute(text("SELECT COUNT(*) FROM models;"))
        if model_res.scalar() == 0:
            logger.info("Seeding open-source approved models catalog...")
            for m in INITIAL_MODELS:
                model_obj = ModelItem(
                    model_id=m["model_id"],
                    name=m["name"],
                    revision=m["revision"],
                    license=m["license"],
                    origin=m["origin"],
                    capabilities=m["capabilities"],
                    hardware_reqs=m["hardware_reqs"],
                    status="approved"
                )
                session.add(model_obj)

        # Seed Tracks and Labs
        track_res = await session.execute(text("SELECT COUNT(*) FROM tracks;"))
        if track_res.scalar() == 0:
            logger.info("Seeding full 20 tracks, courses, lessons and labs from section 4...")
            for t_data in INITIAL_TRACKS:
                track = Track(
                    slug=t_data["slug"],
                    title=t_data["title"],
                    description=t_data["description"],
                    order=t_data["order"],
                    icon=t_data["icon"],
                    outcomes=t_data["outcomes"],
                    prerequisites=[],
                    status="published"
                )
                session.add(track)
                await session.flush()

                # Add a core course for this track
                course = Course(
                    track_id=track.id,
                    slug=f"{t_data['slug']}-mastery",
                    title=f"Core Course: {t_data['title']}",
                    description=f"Практичний курс для опанування напряму {t_data['title']} з реальними лабораторними роботами.",
                    level="intermediate",
                    order=1
                )
                session.add(course)
                await session.flush()

                # Add the corresponding Lab
                lab_data = t_data["lab"]
                lab = Lab(
                    track_id=track.id,
                    slug=lab_data["slug"],
                    semantic_version="1.0.0",
                    title=lab_data["title"],
                    description=lab_data["description"],
                    outcomes=t_data["outcomes"],
                    required_skills=[t_data["slug"]],
                    dataset_allowlist=["built-in", "user-csv"],
                    runtime_class=lab_data["runtime_class"],
                    cost_weight=lab_data["cost_weight"],
                    max_duration_sec=lab_data["max_duration_sec"],
                    grading_version="v1",
                    supported_locales=["uk", "en"],
                    config_schema={"type": "object", "properties": {"seed": {"type": "integer", "default": 42}}},
                    default_config=lab_data["default_config"]
                )
                session.add(lab)
                await session.flush()

                # Add a Mission for the Lab
                mission = Mission(
                    lab_id=lab.id,
                    title=f"Практична місія: {lab_data['title']}",
                    description=f"Налаштуйте параметри, запустіть реальні обчислення та отримайте підтверджений артефакт виконання.",
                    difficulty="starter",
                    rubric={"min_accuracy": 0.8, "completion_criterion": "all_steps_succeeded"},
                    hidden_test_fixtures={"hidden_eval": True},
                    xp_reward=100
                )
                session.add(mission)

                # Add Lesson linked to this Course and Lab
                lesson = Lesson(
                    course_id=course.id,
                    lab_id=lab.id,
                    slug=f"intro-{t_data['slug']}",
                    title=f"Урок 1: Вступ та Лабораторна практика {t_data['title']}",
                    order=1,
                    content_md=f"# {t_data['title']}\n\nЦей модуль присвячений практичній роботі в напрямку **{t_data['title']}**.\n\n### Теоретична основа\n{t_data['description']}\n\n### Завдання лабораторії\nПерейдіть до вкладки конфігурації нижче, перевірте параметри та запустіть виконання.",
                    theory_summary=t_data["description"],
                    visual_algorithm_md="```mermaid\ngraph LR\nInput[Параметри] --> Process[Обчислювальний Worker] --> Metrics[Реальні Метрики]\n```",
                    quiz_questions=[
                        {
                            "question": f"Яка головна мета модуля {t_data['title']}?",
                            "options": [
                                "Отримати реальні відтворювані результати на практиці",
                                "Переглянути декоративну анімацію",
                                "Використати платний закритий API"
                            ],
                            "correct_index": 0,
                            "explanation": "AI Engineering Academy базується виключно на відкритих технологіях та відтворюваних обчисленнях."
                        }
                    ]
                )
                session.add(lesson)

        await session.commit()
        logger.info("Database initialization and initial seeding complete!")

if __name__ == "__main__":
    asyncio.run(init_database())
