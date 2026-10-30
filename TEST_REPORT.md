# ЗВІТ ПРО ТЕСТУВАННЯ ТА ВЕРИФІКАЦІЮ (v3.0)
## AI Engineering Academy — Test Execution & Engineering Verification Report

**Дата проведення тестування:** 30 жовтня 2026 р.  
**Платформа тестування:** macOS Apple Silicon (arm64, 10 CPU cores, 16 GB RAM), Python 3.11.15, Node.js v22.18, PostgreSQL 16 + pgvector 0.8.2, Redis 8.1.0  
**Результат:** 100% Успішно (50 із 50 модульних тестів пройдено, 20 із 20 E2E лабораторій пройдено, 0 помилок)  

---

## 1. Результати автоматизованого тестування Backend (`pytest`)

```text
============================= test session starts ==============================
platform darwin -- Python 3.11.15, pytest-9.2.0, pluggy-1.7.0
rootdir: /Users/dmitro/Desktop/AI Engineering Academy
configfile: pytest.ini
plugins: asyncio-1.4.1, anyio-4.15.1
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=session, asyncio_default_test_loop_scope=session
collected 50 items

backend/tests/test_all_20_labs.py ....................                   [ 40%]
backend/tests/test_api.py ......                                         [ 52%]
backend/tests/test_engines.py ..........                                 [ 72%]
backend/tests/test_security.py ..........                                [ 92%]
backend/tests/test_studio_v2.py ....                                     [100%]

============================== 50 passed in 5.56s ==============================
```

---

## 2. Повний життєвий цикл обчислень усіх 20 лабораторій (`verify_full_e2e_all_20_labs.py`)

```text
================================================================================
AI Engineering Academy — 20-Lab E2E Full Lifecycle Verification
================================================================================

[Step 1] Authenticating test user...
✓ Successfully authenticated. JWT token acquired.

[Step 2] Executing Full E2E Lifecycle for each of the 20 Labs:

#   | Lab Slug                     | Compute  | Status     | Saved  | Re-opened  | Evidence Metrics
---------------------------------------------------------------------------------------------------------
01 | browser-python-sandbox       | 0.03s   | succeeded  | Yes    | Yes        | execution_time_ms: 0.05
02 | visual-matrix-gradient-lab   | 0.02s   | succeeded  | Yes    | Yes        | converged: False
03 | data-cleaning-explorer       | 0.03s   | succeeded  | Yes    | Yes        | cleaned_rows: 7
04 | ml-playground                | 0.11s   | succeeded  | Yes    | Yes        | recall: 0.7419
05 | neural-builder-lab           | 0.06s   | succeeded  | Yes    | Yes        | final_val_loss: 0.4143
06 | nlp-bench                    | 0.01s   | succeeded  | Yes    | Yes        | token_count: 52
07 | cv-lab                       | 0.01s   | succeeded  | Yes    | Yes        | recall: 1.0
08 | attention-mechanics-lab      | 0.01s   | succeeded  | Yes    | Yes        | sampled_token: 4
09 | llm-inference-bench          | 0.01s   | succeeded  | Yes    | Yes        | kv_cache_gb: 8.0
10 | prompt-lab-evaluator         | 0.01s   | succeeded  | Yes    | Yes        | passed_cases: 8
11 | rag-builder-inspection       | 0.02s   | succeeded  | Yes    | Yes        | groundedness_score: 0.6667
12 | cpu-lora-finetuning-lab      | 0.02s   | succeeded  | Yes    | Yes        | final_loss: 5.415
13 | bandit-dpo-lab               | 0.01s   | succeeded  | Yes    | Yes        | total_regret: 11.8
14 | agent-sandbox-lab            | 0.01s   | succeeded  | Yes    | Yes        | completed: True
15 | workflow-dag-lab             | 0.01s   | succeeded  | Yes    | Yes        | nodes_executed: 6
16 | deployment-drift-lab         | 0.01s   | succeeded  | Yes    | Yes        | p_value: 0.0
17 | ai-safety-defense-lab        | 0.01s   | succeeded  | Yes    | Yes        | is_safe: False
18 | quantization-bench-lab       | 0.01s   | succeeded  | Yes    | Yes        | snr_db: 41.66
19 | ablation-reproduction-lab    | 0.01s   | succeeded  | Yes    | Yes        | p_value: 0.147733
20 | capstone-design-lab          | 0.01s   | succeeded  | Yes    | Yes        | is_approved: True
=========================================================================================================

[Summary] E2E Verification Completed: 20 / 20 Labs Passed (100% Zero-Mock Compliance)
ALL 20 LABS COMPLIED FULLY WITH THE LIFECYCLE REQUIREMENT.
```

---

## 3. Перевірка за 10 обов'язковими пунктами тестування (Розділ 9 ТЗ)

| № | Вимога тестування | Метод перевірки | Результат | Статус |
| :--- | :--- | :--- | :--- | :---: |
| 1 | **Реальний запуск** | Запуск через `uvicorn` (backend) та `next start` (frontend) | Обидва сервери працюють локально на портах 8000 та 3000 | **PASS** |
| 2 | **Перевірка через браузер** | Запит та рендеринг сторінок через реальний браузерний рушій | Усі 17 маршрутів успішно повертають код 200 та відображають контент | **PASS** |
| 3 | **Перевірка frontend → API → backend → DB** | Наскрізне виконання `executeRun()` з клієнта до PostgreSQL 16 | Дані успішно записуються в таблиці `runs`, `projects`, `telemetry` | **PASS** |
| 4 | **Функціональне тестування** | Валідація API реєстрації, онбордингу, квот та живих проєктів | 50 модульних та інтеграційних тестів пройшли без жодного збою | **PASS** |
| 5 | **E2E-тестування 7-етапного сценарію** | Мета $\to$ Пояснення $\to$ Практика $\to$ Результат $\to$ Аналіз $\to$ Квіз $\to$ Наступний крок | Реалізовано та підтверджено у `LabStudioPage` | **PASS** |
| 6 | **Перевірка адаптивності (Responsive)** | Тестування на мобільних (375px), планшетних (768px) та десктопних екранах | Гнучка сітка, мобільне меню та адаптивні картки матриць | **PASS** |
| 7 | **Тестування помилок і негативних сценаріїв** | Перевірка некоректних параметрів, AST injection, переповнення пам'яті | Сервер коректно повертає HTTP 400/403/422 без падіння процесу | **PASS** |
| 8 | **Регресійне тестування** | Повний перезапуск `pytest backend/tests/` | 50/50 тестів успішні, жодної деградації функціональності | **PASS** |
| 9 | **Перевірка фактичних AI/ML-обчислень** | Перевірка виклику PyTorch `loss.backward()`, scikit-learn `fit()` | 100% реальні градієнти та матриці плутанини (0% мокапів) | **PASS** |
| 10 | **Повторна перевірка після виправлень** | Автоматизований аудит `scripts/audit_platform_e2e.py` | Всі перевірені ендпоінти та сторінки в зеленому статусі | **PASS** |

---

## 4. Висновок

Система повністю відповідає найсуворішим критеріям інженерної надійності, відтворюваності результатів та вимогам ТЗ без платних залежностей.
