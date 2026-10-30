# AI ENGINEERING ACADEMY — Платформа практичного навчання AI/ML

> **Відкрита браузерна платформа практичного навчання AI/ML Engineering**  
> Версія ТЗ: **1.1** (30 жовтня 2026)  
> Ліцензія: **Повністю вільне та відкрите програмне забезпечення (Open Source)**

---

## 1. Концепція та мета платформи

**AI Engineering Academy** — це відкрита, високопродуктивна платформа для підготовки фахівців:
- **AI Engineer**
- **ML Engineer**
- **Deep Learning / LLM Engineer**
- **MLOps Engineer**
- **Applied Research Engineer**

Навчання побудоване за принципом:  
$$\text{Пояснення} \longrightarrow \text{Налаштування} \longrightarrow \text{Запуск} \longrightarrow \text{Спостереження} \longrightarrow \text{Зміна параметрів} \longrightarrow \text{Тест} \longrightarrow \text{Рефлексія} \longrightarrow \text{Артефакт}$$

### Суворі принципи (Zero-Mock Policy)
1. **Жодних мокапів, заглушок чи фальшивих метрик у production**: кожна кнопка підключена до робочого бекенду; кожен графік втрат, матриця помилок, косинусна схожість або ембедінг розраховуються у реальному часі на серверних воркерах.
2. **Виключно безкоштовні open-source технології**: жодних платних закритих SaaS або proprietary API (OpenAI, Anthropic тощо). Усі моделі та інструменти є відкритими з пермісивними ліцензіями (Apache-2.0, MIT, BSD).
3. **Чесність статусів обчислень**: за наявності Metal/MPS або CUDA виконується дійсне GPU-прискорення; за відсутності — реальний CPU-real розрахунок без симуляції успіху.

---

## 2. Архітектурний стек

| Рівень | Технології | Призначення |
|---|---|---|
| **Web Client** | Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons | Каталог 20 треків, 10-вкладкова інтерактивна студія лабораторій, світла/темна теми за токенами п.24 ТЗ |
| **API & Backend** | Python 3.11, FastAPI (OpenAPI v3), SSE Event Stream | RBAC, маршрутизація, асинхронні квоти, валідація JSON Schema |
| **Relational Database** | PostgreSQL 17 + розширення `vector` (pgvector 0.8.2) | Облік користувачів, дерева курсів, історія запусків (Provenance), зберігання 384-d векторних ембедінгів |
| **Cache & Real-time PubSub** | Redis 7/8 | Потоковий стрімінг SSE подій під час виконання лабораторій |
| **Machine Learning Core** | PyTorch 2.15 (Metal MPS / CPU), scikit-learn 1.9, NumPy, Pandas, SciPy | Реальні тренувальні цикли, адаптери LoRA, метрики ROC-AUC, PCA, k-fold CV, перевірка гіпотез (t-test) |

---

## 3. Матриця 20 навчальних напрямів та їх обчислювальні ядра

| № | Напрям за ТЗ | Лабораторія | Обчислювальне ядро (Backend Engine) |
|---|---|---|---|
| 1 | **AI & Computing Foundations** | Python & SQL Computational Sandbox | AST-перевірка безпеки, in-memory SQLite з телеметрією |
| 2 | **Mathematics for AI** | Matrix Calculus & Gradient Optimization Lab | Власні числа, чисельний vs аналітичний спуск, траєкторія |
| 3 | **Data Science / Engineering** | CSV Explorer & Feature Engineering Lab | Pandas EDA, імпутація пропусків, 1.5*IQR викиди, сканування на PII |
| 4 | **Classical Machine Learning** | ML Model Trainer & Evaluator | Scikit-learn (Random Forest, Gradient Boosting), Confusion Matrix, ROC-AUC |
| 5 | **Deep Learning** | PyTorch Neural Network Training Lab | Повноцінний цикл навчання MLP на CPU, CrossEntropyLoss, Adam |
| 6 | **NLP & Speech** | Tokenization & Semantic Embedding Lab | BPE субловове злиття, TF-IDF косинусна матриця, екстрактор сутностей |
| 7 | **Computer Vision** | CV & Spatial Convolutions Lab | Згорткові фільтри (Sobel, Gaussian), розрахунок IoU для Bounding Boxes |
| 8 | **Generative Models** | Attention & Sampling Lab | Scaled Dot-Product Attention $Softmax(QK^T/\sqrt{d_k})$, Top-p sampling |
| 9 | **LLM Engineering** | LLM Hardware & Latency Profiler | Розрахунок VRAM, KV-cache для контексту, FP16 vs INT8 vs INT4 |
| 10 | **Prompt Engineering** | Prompt Lab & 10-Case Evaluator | **Повна вимога п.6 ТЗ**: 10 категорій тестів, валідація JSON Schema, A/B аналіз |
| 11 | **Retrieval / RAG** | RAG Pipeline & Retrieval Grounding Lab | **Повна вимога п.8 ТЗ**: чанкінг, BM25 + dense пошук у pgvector, RRF fusion |
| 12 | **Training & Fine-tuning** | Supervised Fine-Tuning & LoRA Engine | **Повна вимога п.7 ТЗ**: реальне CPU навчання LoRA адаптерів ($W = W_0 + BA$), Model Card |
| 13 | **Preference Optimization & RL**| Multi-Armed Bandit & DPO Loss Lab | Стратегії UCB1, Thompson Sampling, розрахунок DPO лоссу |
| 14 | **AI Agents / Tool Use** | Autonomous Agent & Sandboxed Tools Lab | ReAct цикл, сервіси CRM/Mailbox/Inventory, Human-in-the-loop approval gate |
| 15 | **Automation & Integrations** | Workflow Graph & Idempotency Lab | Виконавець DAG графу, трансформації, умови, mock HTTP з allowlist |
| 16 | **MLOps / LLMOps** | Model Serving & Data Drift Monitoring | SLO латентність p50/p95/p99, тест Колмогорова-Смірнова на зсув даних |
| 17 | **AI Safety / Responsible AI** | Security Red-Team & Injection Defense | Аудит OWASP LLM01/LLM06 (Prompt Injection, витік PII, jailbreak) |
| 18 | **Optimization / Infra** | Quantization & Memory Footprint Lab | Афінне квантування FP32 -> INT8, розрахунок SNR та економія 4x |
| 19 | **Research Literacy** | Ablation Study & Hypothesis Testing Lab | Перевірка наукових гіпотез, Welch's t-test, p-value, 95% довірчі інтервали |
| 20 | **AI Product Engineering** | Capstone Solution & Model Card Generator | Комплексна рубрика оцінки, аудит походження даних, генерація Model Card |

---

## 4. Дизайн-система (п.24 ТЗ)

Інтерфейс спроєктовано в естетиці професійної структурованості GitHub:
- **Основний брендовий (джинсовий)**: `#6DA2E4`
- **Акцентний (мандариновий)**: `#EC612F`
- **Світлий фон (біла хмара)**: `#EDF5FE`
- **Базова поверхня**: `#FFFFFF`
- **Основний текст (графіт)**: `#24292F`
- **Межі елементів**: `#D0D7DE`
- **Нейтральні поверхні**: `#E8E8E8`
- **Контрастний додатковий (оксид)**: `#5D0D02`
- **Темна тема**: фон `#0D1117`, поверхня `#161B22`, рамки `#30363D`, текст `#E6EDF3` (відповідає WCAG 2.2 AA).

---

## 5. Швидкий старт для розробника

### Передумови
- Python 3.11+ та утиліта `uv`
- Node.js v20+ та `pnpm`
- Локальні PostgreSQL 17 (з pgvector) та Redis

### Запуск системи однією командою:
```bash
# 1. Ініціалізація бази даних та наповнення 20 треками:
make init-db

# 2. Запуск бекенду (FastAPI на http://127.0.0.1:8000):
make dev-backend

# 3. В окремому терміналі запуск клієнту (Next.js на http://localhost:3000):
make dev-frontend
```

### Запуск автоматичних тестів:
```bash
make test
```
*Усі 16 модульних, E2E та валідаційних тестів виконуються менш ніж за 7 секунд.*

---

## 6. Запуск через Docker Compose

Для ізольованого запуску всієї інфраструктури (PostgreSQL 17 pgvector, Redis, Backend, Frontend):
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- API Docs (Swagger): `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 7. Відкриті ліцензії та Attribution

- **FastAPI**: MIT License
- **PostgreSQL & pgvector**: PostgreSQL License / Apache-2.0
- **PyTorch**: BSD-style License
- **scikit-learn**: BSD-3-Clause License
- **Next.js & React**: MIT License
- **Tailwind CSS**: MIT License
- **Lucide Icons**: ISC License
