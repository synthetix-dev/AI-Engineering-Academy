# МАТРИЦЯ ВІДПОВІДНОСТІ ТА СТАНУ ЛАБОРАТОРІЙ (GAP MATRIX)
## AI Engineering Academy — 20 Interactive Laboratory Matrix

**Версія:** 2.0 | 30 жовтня 2026  
**Принцип верифікації:** 100% Zero-Mock Policy. Кожна лабораторія має підтверджений код, ендпоінт, ядро, артефакти та автоматизований E2E тест.

---

### Повна матриця 20 лабораторій

| # | Назва напряму | UI Компонент | API Endpoint | Обчислювальний Engine | Збереження в БД | Рубрика & Eval | E2E Тест | Статус |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **01** | Foundations & Python/SQL | `BrowserPythonSandbox` | `POST /runs` | `foundations_engine.py` (AST Sandbox + SQLite in-memory) | `runs`, `artifacts` | Autograder по прихованих тест-кейсах | `test_lab_01_foundations_python_sandbox` | **VERIFIED** |
| **02** | Mathematics for AI | `MathLabWorkspace.tsx` | `POST /runs` | `math_engine.py` (2D/3D Gradient Descent, NumPy, Eigenvectors) | `runs.metrics`, `runs.artifacts` | Перевірка збіжності $\nabla f(x) \to 0$ | `test_lab_02_math_gradient_descent` | **VERIFIED** |
| **03** | Data Engineering | `DataLabWorkspace.tsx` | `POST /datasets`, `POST /runs` | `data_engine.py` (Pandas profiling, IQR/Z-score outlier detection) | `datasets`, `runs` | Аудит витоку даних (Data Leakage Guard) | `test_lab_03_data_cleaning_explorer` | **VERIFIED** |
| **04** | Classical Machine Learning | `MLLabWorkspace.tsx` | `POST /runs` | `classical_ml.py` (Scikit-Learn Random Forest, GBDT, Decision Tree) | `runs`, `models` | Теплова карта Confusion Matrix, ROC-AUC | `test_lab_04_classical_ml_playground` | **VERIFIED** |
| **05** | Deep Learning | `DeepLearningWorkspace.tsx` | `POST /runs` | `deep_learning.py` (PyTorch MLP/CNN на CPU/MPS) | `runs`, `model_registry` | Криві навчання за епохами (Loss/Acc) | `test_lab_05_deep_learning_neural_builder` | **VERIFIED** |
| **06** | NLP & Speech | `NLPBench` | `POST /runs` | `nlp_engine.py` (Subword/Word tokenization, TF-IDF, NER) | `runs.artifacts` | Метрики стиснення та токенізації | `test_lab_06_nlp_bench` | **VERIFIED** |
| **07** | Computer Vision | `CVLab` | `POST /runs` | `cv_engine.py` (Gaussian/Sobel 2D convolution filters, Pillow) | `runs.artifacts` | Метрики детекції (IoU, Precision, Recall) | `test_lab_07_cv_lab` | **VERIFIED** |
| **08** | Generative Models | `AttentionMechanicsLab` | `POST /runs` | `generative_engine.py` (Scaled Dot-Product Attention, Softmax) | `runs.artifacts` | Перевірка суми вагів $\sum \alpha_i = 1.0$ | `test_lab_08_generative_attention_mechanics` | **VERIFIED** |
| **09** | LLM Engineering | `LLMInferenceBench` | `POST /runs` | `llm_bench_engine.py` (KV-cache profiler, VRAM memory sizing) | `runs.metrics` | Заміри TPS (Tokens Per Second) та VRAM | `test_lab_09_llm_inference_bench` | **VERIFIED** |
| **10** | Prompt Engineering | `PromptStudioWorkspace.tsx` | `POST /runs` | `prompt_engine.py` (10-test suite regression evaluator, JSON Schema) | `eval_suites`, `runs` | 10 тест-кейсів регресії та Score | `test_lab_10_prompt_evaluator` | **VERIFIED** |
| **11** | RAG Systems | `RAGPipelineWorkspace.tsx` | `POST /runs` | `rag_engine.py` (PostgreSQL 17 pgvector + BM25 hybrid search) | `vector_documents`, `runs` | Оцінка обґрунтованості (Groundedness Score) | `test_lab_11_rag_builder_inspection` | **VERIFIED** |
| **12** | Fine-Tuning | `FineTuningWorkspace.tsx` | `POST /runs` | `finetuning_engine.py` (LoRA low-rank adaptation на CPU) | `runs`, `model_registry` | Зниження функції втрат, model card | `test_lab_12_cpu_lora_finetuning` | **VERIFIED** |
| **13** | RL & Preference Learning | `BanditDPOLab` | `POST /runs` | `rl_engine.py` (Multi-Armed Bandit UCB1/Epsilon, DPO Loss) | `runs.metrics` | Вимірювання Regret та DPO Margin | `test_lab_13_bandit_dpo` | **VERIFIED** |
| **14** | Autonomous AI Agents | `AgentWorkspace.tsx` | `POST /runs` | `agent_engine.py` (ReAct loop: Thought -> Action -> Observation) | `audit_events`, `runs` | Human-in-the-Loop підтвердження дій | `test_lab_14_agent_sandbox` | **VERIFIED** |
| **15** | Automation & Integrations | `AutomationDAGWorkspace.tsx` | `POST /runs` | `automation_engine.py` (NetworkX DAG execution, SSRF safe HTTP) | `runs.artifacts` | Повузлове проходження графу з логами | `test_lab_15_workflow_dag` | **VERIFIED** |
| **16** | MLOps / LLMOps | `MLOpsDriftWorkspace.tsx` | `POST /runs` | `mlops_engine.py` (Kolmogorov-Smirnov Drift Test, Serving SLO) | `runs`, `models` | Статистика KS, p-value < 0.05 alert | `test_lab_16_deployment_drift` | **VERIFIED** |
| **17** | AI Safety & Defense | `SafetyLab` | `POST /runs` | `safety_engine.py` (Red teaming, Jailbreak & Injection detection) | `runs.artifacts` | Виявлення загрози та блокування | `test_lab_17_ai_safety_defense` | **VERIFIED** |
| **18** | Optimization & Hardware | `QuantizationBench` | `POST /runs` | `optimization_engine.py` (Tensor quantization FP32 -> INT8) | `runs.metrics` | Метрика стиснення пам'яті та SNR dB | `test_lab_18_quantization_bench` | **VERIFIED** |
| **19** | Research & Methods | `AblationReproductionLab` | `POST /runs` | `research_engine.py` (Two-sample Welch t-test, Confidence intervals) | `runs.metrics` | Статистична достовірність гіпотези | `test_lab_19_ablation_reproduction` | **VERIFIED** |
| **20** | Capstone Production | `CapstoneDesignLab` | `POST /runs`, `POST /projects` | `capstone_engine.py` (End-to-end 6-category rubric grading) | `projects`, `portfolios` | Автоматичне оцінювання рубрики (0-100) | `test_lab_20_capstone_design` | **VERIFIED** |
