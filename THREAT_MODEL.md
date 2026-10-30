# МОДЕЛЬ ЗАГРОЗ ТА ПОЛІТИКА БЕЗПЕКИ (THREAT MODEL)
## AI Engineering Academy — Security Architecture & STRIDE Analysis

**Версія:** 2.0 | 30 жовтня 2026  
**Методологія:** Microsoft STRIDE Threat Modeling + OWASP Top 10 LLM / API  

---

### 1. Матриця загроз STRIDE

| Категорія | Опис потенційної загрози | Вектор атаки | Заходи протидії в AI Engineering Academy | Статус |
|:---|:---|:---|:---|:---|
| **Spoofing** (Підміна суб'єкта) | Підробка JWT токенів або сесій інших користувачів | Перехоплення токена, фальсифікація підпису `none` | Асиметричний/HS256 підпис із ротацією `SECRET_KEY`, валідація терміну дії (`exp`), чорний список токенів у Redis | **MITIGATED** |
| **Tampering** (Підміна даних) | Модифікація чужих експериментів, датасетів чи проектів (IDOR) | Зміна `project_id` або `dataset_id` у запитах `PUT/DELETE` | Сувора перевірка власності об'єкта `owner_id == current_user.id` на рівні ORM-запитів перед виконанням дій | **MITIGATED** |
| **Repudiation** (Відмова від дій) | Заперечення виконання деструктивних операцій або перевантаження воркерів | Анонімні або невідслідковувані виклики API | Наскрізний `trace_id` для кожного запуску, структуровані аудит-логи в таблиці `audit_events` | **MITIGATED** |
| **Information Disclosure** (Витік інформації) | Доступ до конфіденційних артефактів, PII чи секретів інфраструктури | Відкриті порти БД/Redis, вивід системного середовища у трейсах | Мережева ізоляція (порти 5432/6379 прив'язані до `127.0.0.1`), фільтрація PII під час профайлінгу датасетів, заборона виводу стектрейсу | **MITIGATED** |
| **Denial of Service** (Відмова в обслуговуванні) | Виснаження ресурсів CPU/пам'яті довгими ML-задачами, Bomb-файли | Нескінченні цикли в Python, завантаження 10GB CSV | Контроль квот (`cpu_seconds_budget`, `storage_bytes_budget`), жорсткий таймаут 120с на запуск, ліміт 50MB на файл | **MITIGATED** |
| **Elevation of Privilege** (Ескалація привілеїв) | Вихід із пісочниці Python до хостової системи (Sandbox Escape) | `().__class__.__bases__[0].__subclasses__()`, виклики `os.system` | Валідація AST-дерева через `ast.NodeVisitor`, повна заборона вузлів `Import`, блокування звернення до приватних атрибутів `_` | **MITIGATED** |

---

### 2. Специфікації захисту ключових векторів

#### 2.1. AST Python Execution Sandbox
Усі скрипти, які виконуються студентами в браузерній пісочниці чи оцінювачі, перевіряються перед передачею в `exec()`:
```python
class ASTSandboxValidator(ast.NodeVisitor):
    FORBIDDEN_CALLS = {"open", "eval", "exec", "globals", "locals", "getattr", "setattr", "__import__", "compile"}
    
    def visit_Import(self, node): raise SecurityException("Imports prohibited")
    def visit_ImportFrom(self, node): raise SecurityException("Imports prohibited")
    def visit_Attribute(self, node):
        if node.attr.startswith("_"): raise SecurityException("Dunder traversal prohibited")
```
Вивід потоку ізолюється через `contextlib.redirect_stdout`, що унеможливлює стан перегонів (race condition) між користувачами.

#### 2.2. Захист від SSRF (Server-Side Request Forgery)
У модулі автоматизації DAG (`automation_engine.py`) будь-які зовнішні HTTP-виклики проходять валідацію:
1. Заборона IP-адрес локальних мереж (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
2. Заборона Loopback та Link-Local адрес (`127.0.0.1`, `169.254.169.254` AWS/GCP metadata).
3. Дозволено виклики лише до білого списку освітніх та публічних сервісів.

#### 2.3. Захист від Prompt Injection та Jailbreak
Лабораторія `ai-safety-defense-lab` перевіряє вхідні промпти на:
1. Direct Prompt Injection (спроби обходу системних інструкцій: "Ignore previous directions").
2. Exfiltration attempts (спроби вилучення внутрішніх API ключів).
3. PII Leakage (сканування номерів карток, паспортних даних та email).
