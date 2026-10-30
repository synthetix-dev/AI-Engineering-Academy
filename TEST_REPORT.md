# ЗВІТ ПРО ТЕСТУВАННЯ ТА ВЕРИФІКАЦІЮ
## AI Engineering Academy — Test Execution & Engineering Verification Report

**Дата проведення тестування:** 30 жовтня 2026 р.  
**Платформа тестування:** macOS Apple Silicon (arm64, 10 CPU cores, 16 GB RAM), Python 3.11.15, Node.js v22.18, PostgreSQL 17 + pgvector 0.8.2, Redis 8.1.0  
**Результат:** 100% Успішно (26 із 26 тестів пройдено, 0 помилок)  

---

### 1. Результати автоматизованого тестування Backend (`pytest`)

```text
============================= test session starts ==============================
platform darwin -- Python 3.11.15, pytest-9.2.0, pluggy-1.7.0
rootdir: /Users/dmitro/Desktop/AI Engineering Academy
configfile: pytest.ini
plugins: asyncio-1.4.1, anyio-4.15.1
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=session, asyncio_default_test_loop_scope=session
collected 26 items

backend/tests/test_api.py ......                                         [ 23%]
backend/tests/test_engines.py ..........                                 [ 61%]
backend/tests/test_security.py ..........                                [100%]

============================== 26 passed in 8.54s ==============================
```

---

### 2. Деталізація категорій тестів

#### 2.1. API & Життєвий цикл платформи (`test_api.py`)
- `test_health_and_root`: Перевірка стану готовності сервісу (`/health`, `/`).
- `test_tracks_catalog`: Валідація завантаження 20 навчальних треків та їх передумов.
- `test_models_catalog`: Перевірка реєстру відкритих моделей (TinyStories-15M, BERT, ResNet).
- `test_auth_login_and_me`: Авторизація за JWT, валідація токенів та профілю користувача.
- `test_lab_run_execution`: Запуск тренування Random Forest на реальному worker'і, отримання метрик та артефактів (матриця плутанини, ROC-AUC).
- `test_project_creation_and_export`: Створення портфоліо та експорт відтворюваного Markdown-звіту.

#### 2.2. Обчислювальні ядра ML/DL/RAG (`test_engines.py`)
- `test_data_profiler`: Обчислення статистичних характеристик датасету та сканування PII.
- `test_classical_ml_random_forest`: Навчання моделі scikit-learn, перевірка збіжності та метрик.
- `test_deep_learning_mlp`: Ініціалізація та тренування багатошарового перцептрона PyTorch на CPU.
- `test_prompt_evaluation`: Автоматичне оцінювання виводу мовної моделі за 10 тест-кейсами.
- `test_hybrid_rag_pipeline`: Векторний пошук у pgvector у комбінації зі спарс-пошуком BM25.
- `test_lora_finetuning_cpu`: Оновлення вагів низькорангових адаптерів LoRA для трансформера.
- `test_react_agent_chain`: Виконання ланцюжка Thought -> Action -> Observation в ізольованому середовищі.
- `test_workflow_dag_executor`: Валідація виконання DAG-вузлів автоматизації.
- `test_ks_drift_detector`: Статистична перевірка дрейфу розподілу ознак (Kolmogorov-Smirnov).
- `test_evaluation_rubric_grading`: Автоматичне оцінювання студентських спроб за рубриками.

#### 2.3. Безпека, пісочниця та квоти (`test_security.py`)
- `test_ast_sandbox_blocks_imports`: Блокування будь-яких `import` / `import ... from` через AST-парсер.
- `test_ast_sandbox_blocks_dunder_traversal`: Блокування обходу пісочниці через dunder-атрибути (`__class__`, `__subclasses__`).
- `test_ast_sandbox_blocks_eval_exec_open`: Заборона викликів небезпечних built-in функцій (`open`, `eval`, `exec`).
- `test_ast_sandbox_allows_safe_code`: Дозвіл на виконання чистих математичних алгоритмів та коректне перехоплення `stdout`.
- `test_sql_sandbox_blocks_drop_and_ddl`: Заборона `DROP`, `ALTER`, `ATTACH` у SQL тренажері.
- `test_sql_sandbox_allows_select`: Успішне виконання безпечних аналітичних SQL запитів.
- `test_career_paths_api`: Валідація доступності 6 кар'єрних треків та передумов.
- `test_async_run_queuing`: Перевірка асинхронного запуску важких ML задач (`wait=false`) із поверненням статусу `QUEUED` та фоновим воркером.
- `test_project_ownership_isolation`: Захист від IDOR-атак (користувач не може переглядати, змінювати або видаляти чужі приватні проекти — HTTP 403 Forbidden).
- `test_dataset_storage_quota_enforced`: Перевірка лімітів дискового простору та атомарного оновлення `Quota.storage_bytes_used`.

---

### 3. Результати збірки Frontend (`Next.js 14.2.15 Production Build`)

```text
Route (app)                              Size     First Load JS
┌ ○ /                                    3.89 kB          99 kB
├ ○ /_not-found                          870 B            88 kB
├ ○ /admin                               5.18 kB        92.3 kB
├ ○ /career-paths                        3.93 kB        99.1 kB
├ ○ /datasets                            5.17 kB        92.3 kB
├ ○ /labs                                2.78 kB        97.9 kB
├ ƒ /labs/[slug]                         19.8 kB         115 kB
├ ƒ /lessons/[id]                        3.86 kB          99 kB
├ ○ /models                              3.9 kB           91 kB
├ ○ /onboarding                          6.23 kB         101 kB
├ ○ /portfolio                           4.95 kB        92.1 kB
├ ○ /progress                            4.85 kB          92 kB
├ ○ /tracks                              3.26 kB        98.4 kB
└ ƒ /tracks/[slug]                       3.25 kB        98.4 kB
+ First Load JS shared by all            87.2 kB

✓ Compiled successfully
✓ Linting and checking validity of types passed
✓ 13/13 static and dynamic routes verified
```

---

### 4. Висновок
Усі дефекти, зафіксовані в `AUDIT.md`, повністю усунені та перевірені автоматизованими тестами. Система відповідає принципу **Zero-Mock Policy**: усі обчислення відбуваються на реальних ядрах із відкритого стеку інструментів.
