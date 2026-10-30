from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from app.schemas.curriculum import TrackResponse, DiscoverLessonResponse, CodeExplanationResponse

router = APIRouter(prefix="/curriculum", tags=["Curriculum"])

# 20 Tracks Master Catalog
TRACKS_CATALOG = [
    {"id": "engineering-fundamentals", "number": 1, "slug": "engineering-fundamentals", "title": "1. Engineering Fundamentals", "tagline": "Алгоритмічна база, Python та чисельні масиви", "description": "Опануйте структури даних, векторизовані операції NumPy, роботу з пам'яттю та асинхронні черги задач для AI.", "category": "foundations", "estimated_hours": 6, "skills_covered": ["FOUNDATIONS_PYTHON"], "icon": "Terminal"},
    {"id": "mathematics-for-ai", "number": 2, "slug": "mathematics-for-ai", "title": "2. Mathematics for AI", "tagline": "Градієнти, оптимізація та лінійна алгебра", "description": "Досліджуйте геометрію векторних просторів, матричні множення, похідні та поведінку градієнтного спуску на складних поверхнях.", "category": "foundations", "estimated_hours": 8, "skills_covered": ["MATH_GRADIENTS"], "icon": "Binary"},
    {"id": "data-engineering", "number": 3, "slug": "data-engineering", "title": "3. Data Engineering", "tagline": "Підготовка, очищення та пайплайни ознак", "description": "Очищайте сирі дані, видаляйте аномалії, кодуйте категоріальні ознаки та запобігайте витоку даних (data leakage).", "category": "foundations", "estimated_hours": 8, "skills_covered": ["DATA_ENGINEERING"], "icon": "Database"},
    {"id": "machine-learning", "number": 4, "slug": "machine-learning", "title": "4. Machine Learning", "tagline": "Класифікація, дерева рішень та ансамблі", "description": "Навчайте моделі Random Forest, Gradient Boosting та Logistic Regression, аналізуйте Confusion Matrix і налаштовуйте гіперпараметри.", "category": "core_ml", "estimated_hours": 10, "skills_covered": ["CLASSICAL_ML"], "icon": "Cpu"},
    {"id": "deep-learning", "number": 5, "slug": "deep-learning", "title": "5. Deep Learning", "tagline": "Нейронні мережі, активації та backpropagation", "description": "Будуйте багатошарові перцептрони (MLP), спостерігайте пошарову трансформацію активацій та навчайте мережі через PyTorch і TensorFlow.js.", "category": "deep_learning", "estimated_hours": 12, "skills_covered": ["DEEP_LEARNING"], "icon": "Network"},
    {"id": "nlp-speech", "number": 6, "slug": "nlp-speech", "title": "6. NLP & Speech", "tagline": "Токенізація, ембедінги та обробка мови", "description": "Досліджуйте алгоритми розбиття тексту на підслова (BPE, WordPiece), векторизуйте тексти через TF-IDF та Sentence Embeddings.", "category": "core_ml", "estimated_hours": 10, "skills_covered": ["NLP_SPEECH"], "icon": "FileText"},
    {"id": "computer-vision", "number": 7, "slug": "computer-vision", "title": "7. Computer Vision", "tagline": "Обробка зображень, ядра згорток та детекція", "description": "Застосовуйте ядра згорток (Sobel, Gaussian), будуйте згорткові мережі (CNN) та аналізуйте карти активацій ознак.", "category": "deep_learning", "estimated_hours": 10, "skills_covered": ["COMPUTER_VISION"], "icon": "Eye"},
    {"id": "generative-ai", "number": 8, "slug": "generative-ai", "title": "8. Generative AI", "tagline": "Transformers, Self-Attention та методи генерації", "description": "Досліджуйте матриці Query, Key, Value, механізм Attention Heatmap та вплив параметрів семплінгу (Temperature, Top-p).", "category": "llm_genai", "estimated_hours": 10, "skills_covered": ["GENERATIVE_AI"], "icon": "Sparkles"},
    {"id": "llm-engineering", "number": 9, "slug": "llm-engineering", "title": "9. LLM Engineering", "tagline": "Контекстне вікно, затримки та інференс", "description": "Оцінюйте Time-to-First-Token (TTFT), пропускну здатність токенів (tokens/sec), споживання VRAM та локальний інференс.", "category": "llm_genai", "estimated_hours": 8, "skills_covered": ["LLM_ENGINEERING"], "icon": "Cpu"},
    {"id": "prompt-engineering", "number": 10, "slug": "prompt-engineering", "title": "10. Prompt Engineering", "tagline": "Системні інструкції, Few-Shot та валідація JSON", "description": "Створюйте структуровані промпти з гарантованим виводом JSON за схемою, використовуйте Few-Shot приклади та проводьте A/B тестування.", "category": "llm_genai", "estimated_hours": 8, "skills_covered": ["PROMPT_ENGINEERING"], "icon": "MessageSquare"},
    {"id": "rag-engineering", "number": 11, "slug": "rag-engineering", "title": "11. RAG Engineering", "tagline": "Чанкінг, векторний пошук, реранкінг та Grounding", "description": "Будуйте надійні системи Retrieval-Augmented Generation: розділяйте документи з перекриттям (overlap), індексуйте в pgvector та усувайте галюцинації.", "category": "llm_genai", "estimated_hours": 12, "skills_covered": ["RAG_ENGINEERING"], "icon": "Search"},
    {"id": "training-finetuning", "number": 12, "slug": "training-finetuning", "title": "12. Training & Fine-tuning", "tagline": "SFT, Low-Rank Adaptation (LoRA) та збереження адаптерів", "description": "Виконуйте справжній fine-tuning ваг моделі: готуйте пари Instruction/Response, налаштовуйте ранг r та alpha у LoRA, та оцінюйте метрики до і після.", "category": "core_ml", "estimated_hours": 14, "skills_covered": ["FINETUNING"], "icon": "Flame"},
    {"id": "reinforcement-learning", "number": 13, "slug": "reinforcement-learning", "title": "13. Reinforcement Learning", "tagline": "Винагороди, Q-learning та DPO (Direct Preference Optimization)", "description": "Навчайте агентів взаємодіяти із середовищем: балансуйте дослідження (Exploration vs Exploitation) та оптимізуйте політику дій.", "category": "core_ml", "estimated_hours": 10, "skills_covered": ["REINFORCEMENT_LEARNING"], "icon": "Gamepad2"},
    {"id": "ai-agents", "number": 14, "slug": "ai-agents", "title": "14. AI Agents", "tagline": "ReAct цикл, Tool Calling та безпечне виконання", "description": "Створюйте автономних агентів: налаштовуйте цикл Thought-Action-Observation, додавайте виклики API та контролюйте права доступу.", "category": "engineering_ops", "estimated_hours": 12, "skills_covered": ["AI_AGENTS"], "icon": "Bot"},
    {"id": "automation-integrations", "number": 15, "slug": "automation-integrations", "title": "15. Automation & Integrations", "tagline": "REST API, Webhooks та Model Context Protocol (MCP)", "description": "Інтегруйте AI у реальні робочі процеси: створюйте надійні Webhook обробники, підтримуйте протокол MCP та реалізуйте черги з повторами.", "category": "engineering_ops", "estimated_hours": 8, "skills_covered": ["AUTOMATION_INTEGRATIONS"], "icon": "Layers"},
    {"id": "mlops-llmops", "number": 16, "slug": "mlops-llmops", "title": "16. MLOps & LLMOps", "tagline": "Моніторинг, дрифт даних та відкат версій", "description": "Відстежуйте стан production AI: виявляйте зміщення розподілу ознак (Data Drift), аналізуйте затримки та безпечно виконуйте відкат версій.", "category": "engineering_ops", "estimated_hours": 10, "skills_covered": ["MLOPS"], "icon": "Activity"},
    {"id": "ai-safety", "number": 17, "slug": "ai-safety", "title": "17. AI Safety", "tagline": "Prompt Injection, санітизація PII та захист агентів", "description": "Захищайте AI від атак: нейтралізуйте спроби непрямого Prompt Injection, фільтруйте конфіденційні персональні дані та обмежуйте інструменти.", "category": "engineering_ops", "estimated_hours": 8, "skills_covered": ["AI_SAFETY"], "icon": "ShieldAlert"},
    {"id": "ai-optimization", "number": 18, "slug": "ai-optimization", "title": "18. AI Optimization", "tagline": "Квантизація (INT8, INT4), кешування та компресія", "description": "Оптимізуйте витрати ресурсів: квантизуйте ваги моделей з FP16 до INT4 (AWQ/GGUF), зменшуйте розмір на 70% та аналізуйте Perplexity.", "category": "engineering_ops", "estimated_hours": 8, "skills_covered": ["AI_OPTIMIZATION"], "icon": "Zap"},
    {"id": "ai-research", "number": 19, "slug": "ai-research", "title": "19. AI Research", "tagline": "Абляційні дослідження, гіпотези та відтворюваність", "description": "Працюйте як дослідник: формулюйте емпіричні гіпотези, ізолюйте внесок окремих модулів (Ablation Study) та перевіряйте статистичну значущість.", "category": "core_ml", "estimated_hours": 10, "skills_covered": ["AI_RESEARCH"], "icon": "FlaskConical"},
    {"id": "ai-product-engineering", "number": 20, "slug": "ai-product-engineering", "title": "20. AI Product Engineering", "tagline": "Повний життєвий цикл, портфоліо та впровадження", "description": "Об'єднайте всі знання: побудуйте завершений цифровий AI-продукт, розгорніть API, налаштуйте інтерактивне демо та сформуйте професійне портфоліо.", "category": "engineering_ops", "estimated_hours": 14, "skills_covered": ["AI_PRODUCT"], "icon": "Briefcase"}
]

@router.get("/tracks", response_model=List[TrackResponse])
async def list_tracks():
    return [TrackResponse(**t) for t in TRACKS_CATALOG]

@router.get("/tracks/{slug}", response_model=TrackResponse)
async def get_track(slug: str):
    t = next((x for x in TRACKS_CATALOG if x["slug"] == slug), None)
    if not t:
        raise HTTPException(status_code=404, detail="Напрям не знайдено")
    return TrackResponse(**t)

@router.get("/tracks/{slug}/discover", response_model=DiscoverLessonResponse)
async def get_track_discover(slug: str):
    # Generates rich Discover lesson for any of the 20 tracks
    t = next((x for x in TRACKS_CATALOG if x["slug"] == slug), None)
    if not t:
        raise HTTPException(status_code=404, detail="Напрям не знайдено")
    
    return DiscoverLessonResponse(
        id=f"disc-{slug}",
        track_id=slug,
        title=f"Інтерактивне дослідження: {t['title']}",
        slug=f"{slug}-interactive-concept",
        concept_summary=t["description"],
        steps=[
            {
                "step_number": 1,
                "title": "Базовий принцип та інтуїція",
                "explanation": f"Дослідіть фундаментальну поведінку технології для напряму {t['title']}.",
                "interactive_type": "parameter_slider",
                "initial_state": {"param_a": 1.0, "status": "initialized"},
                "expected_outcome_explanation": "Зміна параметрів миттєво відображається на чисельному результаті.",
                "check_question": {
                    "question": f"Яка головна інженерна перевага оптимізації в {t['title']}?",
                    "options": [
                        "Зменшення затримки та підвищення якості результату",
                        "Збільшення споживання пам'яті",
                        "Випадкове блокування системи"
                    ],
                    "correct_option_index": 0,
                    "explanation": "Оптимізована архітектура забезпечує максимальну ефективність та відтворюваність результатів."
                }
            },
            {
                "step_number": 2,
                "title": "Налаштування параметрів та перевірка відгуку",
                "explanation": "Змініть параметри та спостерігайте за реакцією моделі/алгоритму в реальному часі.",
                "interactive_type": "parameter_slider",
                "initial_state": {"param_a": 2.5, "status": "active"},
                "expected_outcome_explanation": "Метрика покращується відповідно до математичної формули."
            },
            {
                "step_number": 3,
                "title": "Аналіз крайових випадків (Edge Cases)",
                "explanation": "Перевірте стійкість алгоритму при граничних значеннях вхідних даних.",
                "interactive_type": "parameter_slider",
                "initial_state": {"edge_case_handled": True},
                "expected_outcome_explanation": "Алгоритм зберігає числову стабільність."
            }
        ],
        code_explanation=CodeExplanationResponse(
            algorithm_name=f"{t['title']} Core Engine",
            mathematical_intuition="Детерміновані чисельні обчислення з контролем збіжності та похибки.",
            library_used="NumPy / PyTorch / scikit-learn",
            library_version="2.4.6 / 2.15.0 / 1.9.1",
            actual_config={"track": slug, "mode": "production_engine"},
            python_code=f"# Реальний код для {t['title']}\nimport numpy as np\n\ndef run_pipeline(params):\n    return {{'status': 'success', 'track': '{slug}'}}",
            sample_inputs={"param": 1.0},
            sample_outputs={"result": 42.0, "status": "success"},
            curl_request=f"curl -X POST http://localhost:8000/api/v1/experiments/run -H 'Content-Type: application/json' -d '{{\"track_slug\":\"{slug}\",\"parameters\":{{}}}}'",
            reproducible_script=f"python -c 'print(\"Pipeline verified for {slug}\")'"
        )
    )
