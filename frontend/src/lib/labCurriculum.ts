export interface LabPedagogicalData {
  slug: string;
  trackOrder: number;
  trackTitle: string;
  category: string;
  goal: string;
  conceptSummary: string;
  intuitionBullets: string[];
  targetCriteria: {
    metricName: string;
    targetValue: string;
    description: string;
  };
  diagnosticTips: {
    condition: string;
    diagnosis: string;
    recommendation: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  nextStep: {
    title: string;
    description: string;
    href: string;
    actionLabel: string;
  };
}

export const LAB_CURRICULUM: Record<string, LabPedagogicalData> = {
  "browser-python-sandbox": {
    slug: "browser-python-sandbox",
    trackOrder: 1,
    trackTitle: "AI & Computing Foundations",
    category: "Foundations",
    goal: "Опанувати написання оптимізованого коду для AI та аналізувати часову складність алгоритмів (Big-O).",
    conceptSummary: "Обчислювальна складність алгоритму визначає, чи зможе ваша модель обробити мільйон запитів без збою пам'яті. Уникайте вкладених циклів O(n²) при роботі з великими масивами ембедингів.",
    intuitionBullets: [
      "Векторизовані операції NumPy у 50-100 разів швидші за стандартні цикли Python завдяки SIMD інструкціям CPU.",
      "Безпечна AST-пісочниця перевіряє код на відсутність небезпечних операцій введення/виведення перед запуском на воркері.",
      "Для ефективної роботи з AI-даними завжди використовуйте генератори та пакетну обробку замість завантаження всього масиву в RAM."
    ],
    targetCriteria: {
      metricName: "Execution Time",
      targetValue: "< 50 ms",
      description: "Алгоритм повинен виконуватися за сублінійний або лінійний час без витоків пам'яті."
    },
    diagnosticTips: [
      {
        condition: "Час виконання перевищує 100 ms",
        diagnosis: "Можлива наявність неоптимальних циклів O(n²) або надмірного копіювання пам'яті.",
        recommendation: "Замініть циклічну обробку списків на матричні операції NumPy або list comprehensions."
      }
    ],
    quiz: {
      question: "Чому матричні обчислення в NumPy працюють у десятки разів швидше за звичайні списки Python?",
      options: [
        "NumPy написаний на C та використовує оптимізовані скомпільовані BLAS/SIMD інструкції",
        "NumPy автоматично орендує хмарні GPU без відома користувача",
        "NumPy ігнорує типи даних і не перевіряє результати"
      ],
      correctIndex: 0,
      explanation: "NumPy зберігає однорідні дані в неперервних блоках пам'яті C, що дозволяє процесору виконувати паралельні векторні команди SIMD."
    },
    nextStep: {
      title: "Наступний модуль: Mathematics for AI",
      description: "Перейдіть до розрахунку матричних похідних та градієнтного спуску.",
      href: "/labs/visual-matrix-gradient-lab",
      actionLabel: "До математичної лабораторії →"
    }
  },

  "visual-matrix-gradient-lab": {
    slug: "visual-matrix-gradient-lab",
    trackOrder: 2,
    trackTitle: "Mathematics for AI",
    category: "Mathematics",
    goal: "Зрозуміти фізичний і геометричний зміст градієнта та навчитися підбирати темп навчання (Learning Rate) без вибуху кроку.",
    conceptSummary: "Градієнт ∇f(x, y) — це вектор найшвидшого зростання функції. Для мінімізації функції втрат ми рухаємося в протилежному напрямку (-∇f). Якщо темп навчання завеликий, алгоритм починає осцилювати й дивергувати.",
    intuitionBullets: [
      "Малий Learning Rate (0.001) гарантує стабільність, але потребує сотень ітерацій.",
      "Надто великий Learning Rate (0.5) перестрибує глобальний мінімум і розкидає ваги до нескінченності (NaN).",
      "Моментум (Momentum) накопичує кінетичну енергію вектора руху, допомагаючи долати локальні плато та яри."
    ],
    targetCriteria: {
      metricName: "Gradient Discrepancy",
      targetValue: "< 1e-5",
      description: "Аналітичний градієнт повинен ідеально збігатися з чисельним кінцево-різницевим розрахунком."
    },
    diagnosticTips: [
      {
        condition: "Final Loss прямує до нескінченності або NaN",
        diagnosis: "Сталася дивергенція градієнтного спуску (Gradient Explosion).",
        recommendation: "Зменшіть Learning Rate у 5-10 разів (наприклад, з 0.2 до 0.02) або застосуйте Gradient Clipping."
      }
    ],
    quiz: {
      question: "Що станеться з процесом оптимізації, якщо встановити занадто великий Learning Rate (η = 2.0)?",
      options: [
        "Траєкторія почне осцилювати, перестрибуватиме мінімум і розійдеться в нескінченність",
        "Модель миттєво знайде глобальний мінімум за 1 ітерацію",
        "Функція активації вимкнеться назавжди"
      ],
      correctIndex: 0,
      explanation: "Завеликий крок зміщення веде до перестрибування точки мінімуму та геометричної прогресії росту градієнтів (дивергенції)."
    },
    nextStep: {
      title: "Наступний модуль: Data Engineering & Cleaning",
      description: "Навчіться очищати та масштабувати дані перед подачею на вхід оптимізатору.",
      href: "/labs/data-cleaning-explorer",
      actionLabel: "До лабораторії даних →"
    }
  },

  "data-cleaning-explorer": {
    slug: "data-cleaning-explorer",
    trackOrder: 3,
    trackTitle: "Data Science & Data Engineering",
    category: "Data Engineering",
    goal: "Опанувати автоматичний аудит якості даних: імпутацію пропусків, фільтрацію викидів (IQR) та захист від витоку PII.",
    conceptSummary: "Якість будь-якої AI-системи обмежується якістю вхідних даних («Garbage In, Garbage Out»). Пропуски можуть зламати лінійні моделі, а екстремальні викиди спотворюють вагові коефіцієнти.",
    intuitionBullets: [
      "Масштабування ознак (StandardScaler) приводить усі змінні до нульового середнього та одиничної дисперсії.",
      "Автоматичний аудит PII захищає від потрапляння номерів карток, телефонів та паспортів у тренувальний сет.",
      "Викиди за межами 1.5 * IQR (Interquartile Range) часто є помилками збору або сенсорними збоями."
    ],
    targetCriteria: {
      metricName: "Cleaned Data Ratio",
      targetValue: "100% Valid",
      description: "Усі пропущені значення заповнено, чутливі дані замасковано, викиди оброблено."
    },
    diagnosticTips: [
      {
        condition: "PII Detected > 0",
        diagnosis: "У вибірці виявлено неанонімізовані персональні дані.",
        recommendation: "Увімкніть опцію Regex PII Masking для приховування чутливих номерів та адрес."
      }
    ],
    quiz: {
      question: "Чому StandardScaler важливий для градієнтних моделей та нейромереж?",
      options: [
        "Він вирівнює масштаби ознак, запобігаючи домінуванню колонок з великими числами над градієнтом",
        "Він видаляє всі рядки з негативними значеннями",
        "Він автоматично перетворює текст на звук"
      ],
      correctIndex: 0,
      explanation: "Різні масштаби (наприклад, вік 20-80 і дохід 10000-500000) створюють видовжені яри на поверхні втрат, сповільнюючи збіжність."
    },
    nextStep: {
      title: "Наступний модуль: Classical Machine Learning",
      description: "Навчіть Random Forest та Logistic Regression на підготовлених даних.",
      href: "/labs/ml-playground",
      actionLabel: "До лабораторії Machine Learning →"
    }
  },

  "ml-playground": {
    slug: "ml-playground",
    trackOrder: 4,
    trackTitle: "Classical Machine Learning",
    category: "Machine Learning",
    goal: "Навчитися оцінювати класифікаційні моделі через Confusion Matrix, балансувати Precision/Recall та обирати Decision Threshold.",
    conceptSummary: "Висока точність (Accuracy 99%) оманлива при незбалансованих класах. У медичній діагностиці чи виявленні шахрайства пропуск хворого або зловмисника (False Negative) у рази небезпечніший за хибну тривогу (False Positive).",
    intuitionBullets: [
      "Decision Threshold 0.5 — це лише дефолтне значення. Зниження порогу збільшує Recall ціною зниження Precision.",
      "Random Forest усереднює передбачення десятків некорельованих дерев, що радикально зменшує дисперсію (Variance).",
      "Крива ROC-AUC показує здатність моделі розділяти класи незалежно від обраного порогу."
    ],
    targetCriteria: {
      metricName: "ROC-AUC Score",
      targetValue: "> 0.88",
      description: "Модель повинна демонструвати високу якість розділення позитивних та негативних спостережень."
    },
    diagnosticTips: [
      {
        condition: "False Negatives (FN) занадто високі у критичному сценарії",
        diagnosis: "Модель пропускає забагато цільових випадків через високий поріг відсікання.",
        recommendation: "Знизьте Decision Threshold з 0.50 до 0.30 для максимального захоплення Recall."
      }
    ],
    quiz: {
      question: "Що є більш критичним при детекції шахрайських транзакцій (Fraud Detection)?",
      options: [
        "False Negative (пропуск шахрая), тому краще збільшити Recall",
        "False Positive (блокування легітимного клієнта), тому точність має бути 100%",
        "Кількість дерев завжди повинна дорівнювати кількості ознак"
      ],
      correctIndex: 0,
      explanation: "Пропуск шахрайства веде до прямих фінансових втрат, тому системи оптимізують Recall з контрольованим рівнем Precision."
    },
    nextStep: {
      title: "Наступний модуль: Deep Learning & Neural Architectures",
      description: "Перейдіть від дерев рішень до багатошарових перцептронів на PyTorch.",
      href: "/labs/neural-builder-lab",
      actionLabel: "До студії нейромереж →"
    }
  },

  "neural-builder-lab": {
    slug: "neural-builder-lab",
    trackOrder: 5,
    trackTitle: "Deep Learning",
    category: "Deep Learning",
    goal: "Побудувати та навчити повнозв'язну нейромережу (MLP) на PyTorch, відстежувати норми градієнтів та боротися з перенавчанням.",
    conceptSummary: "Багатошаровий перцептрон апроксимує складні нелінійні межі рішень завдяки чергуванню лінійних шарів та нелінійних активацій (ReLU). Без нелінійності суперпозиція лінійних шарів згортається в один звичайний лінійний шар.",
    intuitionBullets: [
      "ReLU (Rectified Linear Unit) захищає від зникаючого градієнта в позитивній півплощині: похідна завжди 1.",
      "Шар Dropout випадково «вимикає» частину нейронів під час навчання, запобігаючи коадаптації ваг (Overfitting).",
      "Норма градієнта (Gradient Norm) сигналізує про здоров'я бекпропа: значення біля нуля означають затухання, а величезні сплески — вибух."
    ],
    targetCriteria: {
      metricName: "Validation Accuracy",
      targetValue: "> 85.0%",
      description: "Модель повинна узагальнювати нелінійний датасет без надмірного розриву між train та val loss."
    },
    diagnosticTips: [
      {
        condition: "Train Loss спадає, але Validation Loss починає зростати після кількох епох",
        diagnosis: "Класичне перенавчання (Overfitting). Мережа просто запам'ятала тренувальні семпли.",
        recommendation: "Додайте шар Dropout (0.2 - 0.3), зменшіть кількість прихованих нейронів або зупиніть навчання раніше (Early Stopping)."
      }
    ],
    quiz: {
      question: "Що станеться з нейромережею з 10 шарів, якщо прибрати всі функції активації (ReLU/Tanh)?",
      options: [
        "Мережа зведеться до одного еквівалентного лінійного перетворення і не зможе вивчити нелінійні патерни",
        "Мережа автоматично стане згортковою",
        "Швидкість навчання зросте в 10 разів"
      ],
      correctIndex: 0,
      explanation: "Добуток лінійних матриць W1 * W2 * ... * Wn дорівнює одній єдиній матриці W_equiv, тобто мережа втрачає глибину."
    },
    nextStep: {
      title: "Наступний модуль: NLP & Speech Processing",
      description: "Досліджуйте векторизацію тексту та семантичні простори слів.",
      href: "/labs/nlp-bench",
      actionLabel: "До лабораторії NLP →"
    }
  },

  "rag-builder-inspection": {
    slug: "rag-builder-inspection",
    trackOrder: 11,
    trackTitle: "RAG Systems",
    category: "Generative AI",
    goal: "Побудувати надійний RAG-пайплайн з PostgreSQL pgvector та навчитися запобігати галюцинаціям через оцінку Groundedness.",
    conceptSummary: "RAG (Retrieval-Augmented Generation) доповнює мовну модель релевантним контекстом із корпоративної бази знань. Головний виклик інженера — якісний чанкінг та перевірка того, що відповідь базується виключно на знайдених документах.",
    intuitionBullets: [
      "Чанкінг (Chunking) із перекриттям (Overlap) зберігає смисловий контекст на межах абзаців.",
      "Векторний пошук pgvector на основі косинусної близькості знаходить фрагменти за сенсом, навіть якщо слова відрізняються.",
      "Groundedness Score вимірює, яка частка тверджень у фінальній відповіді безпосередньо підтверджена знайденим контекстом."
    ],
    targetCriteria: {
      metricName: "Groundedness Score",
      targetValue: ">= 0.75",
      description: "Відповідь повинна бути повністю обґрунтована знайденим контекстом без вигаданих фактів."
    },
    diagnosticTips: [
      {
        condition: "Groundedness Score < 0.60 (Виявлено галюцинацію)",
        diagnosis: "Модель згенерувала інформацію, якої немає у вибірці документів.",
        recommendation: "Підвищіть поріг косинусної схожості або додайте до системного промпту строгу інструкцію: «Відповідай ТІЛЬКИ на базі наданого контексту»."
      }
    ],
    quiz: {
      question: "Що вимірює метрика Groundedness у RAG-системах?",
      options: [
        "Чи підтверджені згенеровані моделлю твердження знайденим у базі контекстом без фантазій",
        "Швидкість запису векторів на SSD накопичувач",
        "Розмір файлу бази даних у мегабайтах"
      ],
      correctIndex: 0,
      explanation: "Groundedness — ключова інженерна метрика, яка гарантує, що модель не додає галюцинацій та сторонніх домислів."
    },
    nextStep: {
      title: "Наступний модуль: Fine-Tuning LoRA",
      description: "Навчіться адаптувати ваги мовної моделі під специфічні інструкції.",
      href: "/labs/cpu-lora-finetuning-lab",
      actionLabel: "До студії Fine-Tuning →"
    }
  },

  "agent-sandbox-lab": {
    slug: "agent-sandbox-lab",
    trackOrder: 14,
    trackTitle: "AI Agents",
    category: "Autonomous Agents",
    goal: "Створити автономного ReAct-агента, налаштувати виклик інструментів (Tool Calling) та запобігти зацикленню міркувань.",
    conceptSummary: "Агенти використовують цикл ReAct (Thought → Action → Observation). Агент генерує думку про наступний крок, обирає інструмент, виконує дію в ізольованому середовищі та аналізує отримане спостереження до досягнення мети.",
    intuitionBullets: [
      "Строгий ліміт кроків (Max Steps) захищає від вичерпання ресурсів при нескінченних циклах роздумів.",
      "Інструменти повинні повертати структуровані помилки, щоб агент міг виправити свій запит самостійно.",
      "Ручне підтвердження (Human-in-the-Loop) обов'язкове для небезпечних дій: транзакцій, видалення даних чи відправки листів."
    ],
    targetCriteria: {
      metricName: "Task Completion",
      targetValue: "100% Succeeded",
      description: "Агент успішно задіяв відповідні інструменти та сформував остаточну відповідь без збою циклу."
    },
    diagnosticTips: [
      {
        condition: "Агент перевищив максимальну кількість кроків (Max Iterations Reached)",
        diagnosis: "Агент потрапив у циклічний глухий кут або інструмент повернув незрозумілу відповідь.",
        recommendation: "Уточніть системну інструкцію або покращіть опис контрактів інструментів (Tool Description)."
      }
    ],
    quiz: {
      question: "Що означає абревіатура циклу ReAct в архітектурі AI-агентів?",
      options: [
        "Reasoning and Acting (Міркування та Дія)",
        "React.js Frontend Framework",
        "Reactive Active Tokens"
      ],
      correctIndex: 0,
      explanation: "ReAct поєднує логічні ланцюжки роздумів (Chain of Thought) із виконанням дій через зовнішні API та спостереженням результатів."
    },
    nextStep: {
      title: "Наступний модуль: MLOps & Data Drift",
      description: "Опануйте моніторинг продакшен-систем та детекцію зсуву даних.",
      href: "/labs/deployment-drift-lab",
      actionLabel: "До лабораторії MLOps →"
    }
  }
};

export function getCurriculumForLab(slug: string): LabPedagogicalData {
  if (LAB_CURRICULUM[slug]) {
    return LAB_CURRICULUM[slug];
  }

  // Fallback dynamic generator for any lab
  const cleanTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    slug: slug,
    trackOrder: 1,
    trackTitle: cleanTitle,
    category: "AI Engineering",
    goal: `Опанувати професійні інженерні навички в модулі ${cleanTitle} на базі відтворюваних обчислень.`,
    conceptSummary: `Цей модуль забезпечує глибоку практичну підготовку в напрямку ${cleanTitle}. Налаштуйте параметри, запустіть обчислювальний процес на воркері та оцініть результат за метриками.`,
    intuitionBullets: [
      "Всі розрахунки виконуються справжнім бекендом без фіктивних заглушок.",
      "Змінюйте параметри для спостереження за чутливістю системи до вхідних конфігурацій.",
      "Результат автоматично зберігається для верифікації ваших інженерних навичок."
    ],
    targetCriteria: {
      metricName: "Execution Success",
      targetValue: "100%",
      description: "Усі кроки конвеєра повинні бути успішно виконані бекендом."
    },
    diagnosticTips: [
      {
        condition: "Виникла помилка виконання на сервері",
        diagnosis: "Параметри вийшли за допустимі межі або виникла математична нестабільність.",
        recommendation: "Скористайтеся підказками AI-наставника або відновіть дефолтні значення."
      }
    ],
    quiz: {
      question: `Який головний принцип практичної роботи в лабораторії ${cleanTitle}?`,
      options: [
        "Отримання верифікованих відтворюваних результатів на реальних алгоритмах",
        "Сліпе копіювання чужого коду без розуміння",
        "Використання виключно декоративних мокапів"
      ],
      correctIndex: 0,
      explanation: "AI Engineering Academy вимагає глибокого розуміння фізичного змісту кожної операції та перевірки на практиці."
    },
    nextStep: {
      title: "Перейти до інженерних викликів (Solve)",
      description: "Закріпіть отримані знання, виправивши зламану систему в розділі Solve.",
      href: "/solve",
      actionLabel: "До інженерних викликів →"
    }
  };
}
