# Аудит Ліцензій Сторонніх Компонентів (Third-Party Licenses)

## 1. Загальна політика ліцензування
Платформа **AI Engineering Academy 2.0** є відкритим продуктом з ліцензією **MIT License**.
Усі сторонні залежності, математичні бібліотеки, моделі штучного інтелекту та навчальні датасети відібрані відповідно до суворих критеріїв сумісності:
- Тільки пермісивні ліцензії (MIT, Apache-2.0, BSD-2/3-Clause, ISC, CC0 / Public Domain).
- Жодних обов'язкових платних ліцензій або закритих API (OpenAI, Anthropic, Cohere тощо).
- Жодних вірусних copyleft-обмежень (GPLv3), які б обмежували права користувачів на створені ними моделі, ваги або програмний код.

---

## 2. Бібліотеки Бекенду (Python / PyPI)

| Пакет | Версія | Ліцензія | Призначення в системі |
|---|---|---|---|
| **FastAPI** | 0.115+ | MIT | Високопродуктивний асинхронний REST API веб-фреймворк |
| **Pydantic** | 2.9+ | MIT | Типізація та сувора валідація схем даних |
| **Uvicorn** | 0.32+ | BSD-3-Clause | ASGI сервер |
| **SQLAlchemy** | 2.0+ | MIT | ORM та асинхронне ядро роботи з базами даних |
| **aiosqlite** | 0.20+ | MIT | Асинхронний драйвер для SQLite (автономний режим) |
| **PyTorch (torch)** | 2.5+ | BSD-3-Clause | Тензорні обчислення, навчання нейромереж, автодиференціювання, LoRA |
| **scikit-learn** | 1.5+ | BSD-3-Clause | Класичний ML: Random Forest, Decision Trees, K-Means, PCA, метрики |
| **NumPy** | 2.1+ | BSD-3-Clause | Векторні та матричні обчислення, SIMD операції |
| **SciPy** | 1.14+ | BSD-3-Clause | Статистичні тести (t-test, KS-test), оптимізація функцій втрат |
| **Pandas** | 2.2+ | BSD-3-Clause | Обробка табличних даних, аналіз пропусків та датафрейми |
| **PyJWT** | 2.9+ | MIT | Генерація та верифікація JSON Web Tokens |
| **passlib[bcrypt]** | 1.7+ | BSD-3-Clause | Криптографічне хешування паролів |
| **pytest** | 8.3+ | MIT | Автоматизоване тестування |

---

## 3. Фронтенд та Браузерні ML-середовища (Node.js / Browser)

| Пакет | Версія | Ліцензія | Призначення в системі |
|---|---|---|---|
| **Next.js** | 14.x | MIT | React фреймворк з App Router та Server Components |
| **React** | 18.x | MIT | Бібліотека компонентного інтерфейсу |
| **Tailwind CSS** | 3.4+ | MIT | Утилітарна система стилізації з дизайн-токенами |
| **Lucide React** | 0.450+ | ISC | Векторні піктограми інтерфейсу |
| **Pyodide** | 0.26+ | MPL-2.0 | Браузерне виконання Python та NumPy/SciPy у WebAssembly |
| **TensorFlow.js** | 4.20+ | Apache-2.0 | Клієнтське навчання та інференс нейромереж на WebGL/WebGPU |
| **ONNX Runtime Web** | 1.19+ | MIT | Оптимізований крос-платформний інференс моделей у браузері |
| **Transformers.js** | 3.0+ | Apache-2.0 | Токенізація BPE та ембеддінги у браузері |

---

## 4. Використані Датасети (Datasets)

| Датасет | Джерело / Автор | Ліцензія | Використання у треках |
|---|---|---|---|
| **Synthetic ML Benchmarks** | Власна генерація платформи | MIT / CC0 | Детекція викидів, перенавчання, регресія |
| **California Housing** | StatLib / Pace & Barry | Public Domain | Трек 02 (Очищення даних), Трек 04 (Регресія) |
| **SMS Spam Collection** | Almeida et al., UCI ML | CC0 / Public Domain | Трек 06 (NLP та TF-IDF класифікація) |
| **Synthetic RAG Knowledge Base** | AI Engineering Academy | MIT | Трек 11 (Векторний пошук та RAG retrieval) |
| **Synthetic Code/JSON QA** | AI Engineering Academy | MIT | Трек 12 (LoRA Fine-tuning та Instruction tuning) |
| **Security Injection Corpus** | OWASP Top 10 for LLMs test suites | Apache-2.0 / MIT | Трек 18 (AI Safety та Prompt Defense) |

---

## 5. Базові Моделі та Ваги (Open Model Checkpoints)

Всі моделі, що пропонуються для завантаження або клієнтського інференсу, розповсюджуються під дозволеними комерційними ліцензіями:
- **SmolLM-135M-Instruct** (Hugging Face / Loubser et al.) — **Apache-2.0**
- **TinyLlama-1.1B** (Zhang et al.) — **Apache-2.0**
- **all-MiniLM-L6-v2** (Sentence-Transformers / Wang et al.) — **Apache-2.0**
- **DistilBERT-base-uncased** (Sanh et al.) — **Apache-2.0**

---

## 6. Висновок аудиту
Всі 100% компонентів, модулів, моделей та датасетів є вільними від пропрієтарних чи ліцензійних обмежень і повністю дозволені для освітнього, особистого та комерційного використання без сплати роялті.
