from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from backend.app.models.user import User
from backend.app.api.deps import get_optional_user

router = APIRouter(prefix="/mentor", tags=["AI Engineering Mentor"])

class MentorAssistRequest(BaseModel):
    lab_slug: str
    user_goal: str
    current_params: Dict[str, Any] = {}

class MentorAssistResponse(BaseModel):
    explanation: str
    suggested_params: Dict[str, Any]
    suggested_code: str
    diagnostic_tips: List[str]
    action_type: str

# Expert diagnostic repository for AI Engineering Studio
DOMAIN_EXPERTISE = {
    "visual-matrix-gradient-lab": {
        "title": "Математична оптимізація та градієнтний спуск",
        "quick_prompts": [
            "Як досягти швидшої збіжності без осциляцій?",
            "Чому виникає розбіжність при високому Learning Rate?",
            "У чому різниця між квадратичною та сідловою функціями втрат?"
        ],
        "recipes": {
            "fast_convergence": {
                "keywords": ["швидш", "збіжн", "скорост", "faster", "converge"],
                "explanation": (
                    "Для прискорення збіжності градієнтного спуску до глобального мінімуму без перелітання "
                    "рекомендовано встановити оптимальний Learning Rate (0.05-0.15) та достатню кількість ітерацій (35-50). "
                    "На квадратичній поверхні матриця Гессе є додатно визначеною, тому градієнт монотонно спадає до нуля."
                ),
                "params": {"learning_rate": 0.08, "iterations": 40, "loss_function": "quadratic"},
                "code": (
                    "import numpy as np\n\n"
                    "# Оптимізація градієнтного спуску\n"
                    "lr = 0.08\n"
                    "w = np.array([2.5, 3.0])\n"
                    "for step in range(40):\n"
                    "    grad = 2 * w  # Похідна для квадратичної функції L(w) = w^T w\n"
                    "    w = w - lr * grad\n"
                    "print('Final weights:', w)"
                ),
                "tips": [
                    "Слідкуйте за нормою градієнта: вона має прямувати до < 0.01.",
                    "Якщо траєкторія починає коливатися між двома стінками — зменшіть lr на 50%."
                ]
            },
            "default": {
                "explanation": (
                    "Градієнтний спуск обчислює вектор найшвидшого зростання функції втрат та робить крок у протилежному напрямку. "
                    "Параметр Learning Rate визначає довжину кроку. Занадто малий крок призведе до зависання в сідлових точках, "
                    "а занадто великий — до числового переповнення (NaN)."
                ),
                "params": {"learning_rate": 0.05, "iterations": 30, "loss_function": "quadratic"},
                "code": "# Стандартний градієнтний крок: w_new = w - lr * grad",
                "tips": ["Порівнюйте аналітичний градієнт із чисельним для уникнення багів у коді."]
            }
        }
    },
    "neural-builder-lab": {
        "title": "Архітектура та навчання глибоких нейромереж",
        "quick_prompts": [
            "Як запобігти перенавчанню (Overfitting)?",
            "Яку функцію активації краще обрати для внутрішніх шарів?",
            "Як підібрати розмір батчу (Batch Size) та темп навчання?"
        ],
        "recipes": {
            "overfitting": {
                "keywords": ["overfit", "перенавч", "узагальн", "regulariz"],
                "explanation": (
                    "Перенавчання виникає, коли ємність моделі (кількість вагів) значно перевищує складність даних, "
                    "через що мережа просто запам'ятовує навчальну вибірку. Для виправлення зменшіть розмір прихованих шарів, "
                    "використовуйте ReLU/GELU та збільште розмір батчу для згладжування стохастичного градієнта."
                ),
                "params": {"hidden_layers": [16, 8], "learning_rate": 0.01, "epochs": 20, "batch_size": 32, "activation": "relu"},
                "code": (
                    "import torch\nimport torch.nn as nn\n\n"
                    "# Регуляризована MLP архітектура\n"
                    "model = nn.Sequential(\n"
                    "    nn.Linear(8, 16),\n"
                    "    nn.ReLU(),\n"
                    "    nn.Dropout(0.2),\n"
                    "    nn.Linear(16, 8),\n"
                    "    nn.ReLU(),\n"
                    "    nn.Linear(8, 2)\n"
                    ")"
                ),
                "tips": [
                    "Порівнюйте Training Loss та Validation Loss. Якщо Val Loss зростає — зупиняйте навчання (Early Stopping).",
                    "ReLU запобігає затуханню градієнтів порівняно з Sigmoid."
                ]
            },
            "default": {
                "explanation": (
                    "При побудові MLP важливо підтримувати баланс між кількістю параметрів та швидкістю збіжності. "
                    "Оптимізатор Adam адаптивно регулює індивідуальні швидкості навчання для кожного параметра."
                ),
                "params": {"hidden_layers": [32, 16], "learning_rate": 0.01, "epochs": 15, "batch_size": 32, "activation": "relu"},
                "code": "# Базова модель PyTorch на CPU",
                "tips": ["Слідкуйте за кривою втрат у реальному часі."]
            }
        }
    },
    "rag-builder-inspection": {
        "title": "RAG-системи та векторний пошук",
        "quick_prompts": [
            "Як підвищити оцінку обґрунтованості (Groundedness)?",
            "Який розмір чанка обрати для юридичних або технічних текстів?",
            "Як усунути галюцинації під час генерації відповіді?"
        ],
        "recipes": {
            "groundedness": {
                "keywords": ["grounded", "обґрунт", "галюцин", "hallucin", "точн"],
                "explanation": (
                    "Для максимальної обґрунтованості відповіді (Groundedness > 0.8) необхідно подавати в LLM лише релевантні фрагменти "
                    "із високим косинусним скором у pgvector. Також встановлюйте top_k у межах 2-4 для уникнення розмивання уваги моделі."
                ),
                "params": {"query": "Explain semantic vector search with pgvector", "top_k": 3, "similarity_threshold": 0.75},
                "code": (
                    "from sqlalchemy import text\n\n"
                    "# Косинусний векторний пошук pgvector\n"
                    "query_sql = '''\n"
                    "SELECT content, 1 - (embedding <=> :q_vec) AS score\n"
                    "FROM document_chunks\n"
                    "WHERE 1 - (embedding <=> :q_vec) > 0.75\n"
                    "ORDER BY embedding <=> :q_vec ASC\n"
                    "LIMIT 3;\n"
                    "'''"
                ),
                "tips": [
                    "Використовуйте гібридний підхід: dense vector пошук + sparse BM25 ключові слова.",
                    "Додайте в системний промпт жорстке обмеження: 'Відповідай виключно на основі наданого контексту'."
                ]
            },
            "default": {
                "explanation": (
                    "RAG об'єднує векторне вилучення знань із PostgreSQL (pgvector) та генеративну здатність LLM. "
                    "Якість відповіді залежить від стратегії чанкінгу та точності ембедінгів."
                ),
                "params": {"query": "How does RAG work?", "top_k": 2},
                "code": "# Векторний пошук у базі",
                "tips": ["Оцінюйте як Precision ретривера, так і обґрунтованість генератора."]
            }
        }
    },
    "cpu-lora-finetuning-lab": {
        "title": "Fine-Tuning та PEFT (LoRA)",
        "quick_prompts": [
            "Який ранг r та alpha обрати для адаптації мовної моделі?",
            "Скільки параметрів навчається при застосуванні LoRA?",
            "Як уникнути катастрофічного забування (Catastrophic Forgetting)?"
        ],
        "recipes": {
            "rank_tuning": {
                "keywords": ["ранг", "rank", "alpha", "lora", "параметр"],
                "explanation": (
                    "LoRA розкладає зміну матриці вагів Delta W на дві низькорангові матриці: Delta W = B * A, де B in R^{d x r}, A in R^{r x k}. "
                    "Для більшості завдань класифікації та стилізації достатньо рангу r=4 або r=8. "
                    "Коефіцієнт масштабування alpha зазвичай обирають як 2 * r (наприклад, alpha=16 при r=8). "
                    "Це дозволяє скоротити кількість оновлюваних вагів на 99.6%!"
                ),
                "params": {"lora_rank": 8, "lora_alpha": 16, "epochs": 3, "learning_rate": 0.0003},
                "code": (
                    "import torch\nimport torch.nn as nn\n\n"
                    "class LoRALinear(nn.Module):\n"
                    "    def __init__(self, in_features, out_features, r=8, alpha=16):\n"
                    "        super().__init__()\n"
                    "        self.weight = nn.Parameter(torch.randn(out_features, in_features), requires_grad=False)\n"
                    "        self.lora_A = nn.Parameter(torch.randn(r, in_features) * 0.01)\n"
                    "        self.lora_B = nn.Parameter(torch.zeros(out_features, r))\n"
                    "        self.scaling = alpha / r\n\n"
                    "    def forward(self, x):\n"
                    "        return nn.functional.linear(x, self.weight + (self.lora_B @ self.lora_A) * self.scaling)"
                ),
                "tips": [
                    "Ніколи не розморожуйте базові ваги: їх `requires_grad` має бути `False`.",
                    "При навчанні на CPU використовуйте ранг r=4 для мінімізації затримки зворотного проходу."
                ]
            },
            "default": {
                "explanation": (
                    "PEFT (Parameter-Efficient Fine-Tuning) дає змогу донавчати великі моделі на скромному апаратному забезпеченні. "
                    "LoRA зберігає оригінальну модель незмінною, навчаючи лише невеликі адаптери."
                ),
                "params": {"lora_rank": 4, "epochs": 2},
                "code": "# LoRA адаптація вагів",
                "tips": ["Слідкуйте за відсотком зниження втрат."]
            }
        }
    },
    "ai-safety-defense-lab": {
        "title": "Безпека ШІ, Alignment та захист від джейлбрейків",
        "quick_prompts": [
            "Як нейтралізувати Prompt Injection та Jailbreak?",
            "Як налаштувати автоматичну фільтрацію PII (персональних даних)?",
            "Які евристики є найефективнішими проти атак обходу інструкцій?"
        ],
        "recipes": {
            "defense": {
                "keywords": ["ін'єкц", "jailbreak", "захист", "defense", "атак", "safety"],
                "explanation": (
                    "Надійний захист від Prompt Injection будується на багатошаровому підході: "
                    "1. Вхідна санітизація та перевірка регулярними виразами на наявність маркерів обходу ('ignore previous', 'system prompt override'). "
                    "2. Сепарація контексту: чітке розмежування інструкцій розробника та ненадійного користувацького вводу через XML/Markdown теги. "
                    "3. Вихідна перевірка класифікатором безпеки перед відправкою клієнту."
                ),
                "params": {
                    "prompt": "Summarize the customer review safely.",
                    "guard_level": "strict",
                    "filter_pii": True,
                    "block_known_exploits": True
                },
                "code": (
                    "import re\n\n"
                    "INJECTION_PATTERNS = [\n"
                    "    r'(?i)ignore\\s+(all\\s+)?previous\\s+instructions',\n"
                    "    r'(?i)reveal\\s+(the\\s+)?system\\s+prompt',\n"
                    "    r'(?i)dan\\s+mode\\s+enabled'\n"
                    "]\n\n"
                    "def sanitize_input(user_text: str) -> bool:\n"
                    "    for pattern in INJECTION_PATTERNS:\n"
                    "        if re.search(pattern, user_text):\n"
                    "            return False  # Заблоковано: виявлено ознаки зламу\n"
                    "    return True"
                ),
                "tips": [
                    "Ніколи не конкатенуйте системний промпт із користувацьким вводом без захисних розділювачів.",
                    "Впроваджуйте rate-limiting для користувачів, які тричі поспіль викликають спрацювання guardrails."
                ]
            },
            "default": {
                "explanation": (
                    "Безпека ШІ охоплює захист від зловмисних дій користувачів, витоку приватних даних та небажаної поведінки моделей. "
                    "Кожен промпт повинен проходити валідацію до передачі у виконавче ядро."
                ),
                "params": {"prompt": "Sanitized query", "guard_level": "standard"},
                "code": "# Валідація промпта",
                "tips": ["Тестуйте систему відомими red-teaming вибірками."]
            }
        }
    }
}

@router.get("/quick-prompts/{lab_slug}")
async def get_quick_prompts(lab_slug: str):
    """Return tailored diagnostic questions for the given studio lab."""
    domain_info = DOMAIN_EXPERTISE.get(lab_slug)
    if not domain_info:
        return {
            "lab_slug": lab_slug,
            "title": "Інженерна лабораторія AI",
            "quick_prompts": [
                "Як оптимізувати параметри для кращого результату?",
                "Чому виникла помилка під час виконання?",
                "Покажи приклад виробничого коду на Python для цієї задачі."
            ]
        }
    return {
        "lab_slug": lab_slug,
        "title": domain_info["title"],
        "quick_prompts": domain_info["quick_prompts"]
    }

@router.post("/assist", response_model=MentorAssistResponse)
async def assist_learner(
    req: MentorAssistRequest,
    current_user: Optional[User] = Depends(get_optional_user)
):
    """
    Open-source deterministic pedagogical AI Mentor:
    Analyzes parameters, identifies engineering goals, and provides actionable advice,
    runnable Python code, and auto-applicable parameter updates.
    """
    slug = req.lab_slug
    user_goal = req.user_goal.lower()
    domain = DOMAIN_EXPERTISE.get(slug)

    if not domain:
        # Fallback for generic labs
        return MentorAssistResponse(
            explanation=(
                f"Аналіз для лабораторії '{slug}': Ваш запит '{req.user_goal}' проаналізовано. "
                "Рекомендовано перевірити граничні значення параметрів, упевнитись у відповідності типів даних "
                "та запустити експеримент на обчислювальному ядрі CPU для верифікації."
            ),
            suggested_params=req.current_params or {"seed": 42},
            suggested_code="# Реальний Python код для завдання\nprint('Running verified studio pipeline')",
            diagnostic_tips=[
                "Слідкуйте за тривалістю обчислень та споживанням квоти CPU.",
                "Перевірте отримані метрики у вкладці результатів."
            ],
            action_type="general_advice"
        )

    # Match user goal against known recipe keywords
    matched_recipe = None
    for recipe_name, recipe in domain.get("recipes", {}).items():
        if recipe_name == "default":
            continue
        keywords = recipe.get("keywords", [])
        if any(kw in user_goal for kw in keywords):
            matched_recipe = recipe
            break

    if not matched_recipe:
        matched_recipe = domain["recipes"].get("default", list(domain["recipes"].values())[0])

    # Merge suggested params with current params to preserve non-conflicting user choices
    final_params = dict(req.current_params)
    final_params.update(matched_recipe.get("params", {}))

    return MentorAssistResponse(
        explanation=matched_recipe["explanation"],
        suggested_params=final_params,
        suggested_code=matched_recipe["code"],
        diagnostic_tips=matched_recipe["tips"],
        action_type="apply_parameters"
    )
