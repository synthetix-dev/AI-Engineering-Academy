# Інструкція з Розгортання: AI Engineering Academy 2.0

## 1. Загальний огляд
Платформа **AI Engineering Academy 2.0** спроєктована для максимальної гнучкості: від автономного локального запуску на ноутбуці без інтернету до високонавантаженого виробничого кластера у хмарі або on-premise середовищі.

---

## 2. Локальний запуск для розробки (Local Development)

### Вимоги до середовища
- **Node.js**: v20.x або v22.x LTS, менеджер пакетів `pnpm` (>= 9.0)
- **Python**: 3.11+ з підтримкою virtualenv (`uv` або `venv`)
- **Git**

### Крок 1. Клонування та налаштування оточення
```bash
cd ai-engineering-academy-v2

# 1. Налаштування Python бекенду
python3 -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements.txt

# 2. Налаштування Node.js фронтенду
pnpm install
```

### Крок 2. Конфігурація змінних оточення
Створіть файл `.env` у корені проєкту (або використайте значення за замовчуванням):
```env
ENVIRONMENT=development
DATABASE_URL=sqlite+aiosqlite:///./academy_v2.db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=academy_dev_secret_key_change_in_production_32bytes!
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
ALLOW_BROWSER_ONLY_MODE=true
MAX_PARALLEL_TRAINING_JOBS=2
```

### Крок 3. Запуск сервісів
У першому терміналі (Бекенд API):
```bash
source .venv/bin/activate
PYTHONPATH=apps/api uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload
```

У другому терміналі (Next.js Веб-додаток):
```bash
pnpm --filter @academy/web dev
```
Платформа буде доступна за адресою: **http://localhost:3000** (API: **http://localhost:8000/docs**).

---

## 3. Запуск у Docker Compose (Рекомендовано для продакшн-демо)

Повний стек включає:
- `academy-web`: Next.js 14 додаток (SSR + статичні бандли Wasm/TFJS).
- `academy-api`: FastAPI бекенд із чисельними ML-модулями.
- `academy-db`: PostgreSQL 16 з розширенням `pgvector`.
- `academy-cache`: Valkey / Redis 7 для кешування та черг задач.
- `academy-nginx`: Nginx reverse proxy з SSL, rate-limiting та Gzip-компресією.

### Запуск однією командою:
```bash
cd infrastructure/docker
docker compose up -d --build
```

### Перевірка стану контейнерів:
```bash
docker compose ps
```

Додаток буде доступний на портах:
- Веб-інтерфейс: `http://localhost:80`
- API документація: `http://localhost:80/api/v1/docs`

---

## 4. Специфікація змінних оточення (Environment Reference)

| Змінна | Тип | За замовчуванням | Опис |
|---|---|---|---|
| `DATABASE_URL` | String | `sqlite+aiosqlite:///./academy_v2.db` | Підключення до БД (підтримує PostgreSQL `postgresql+asyncpg://...`) |
| `REDIS_URL` | String | `redis://localhost:6379/0` | Черги задач та сесії (fallback на in-memory при недоступності) |
| `JWT_SECRET_KEY` | String | *обов'язковий у prod* | 32+ байтний ключ для підпису JWT-токенів |
| `CORS_ORIGINS` | JSON list | `["*"]` | Дозволені джерела CORS |
| `MAX_WORKERS` | Integer | `4` | Кількість воркерів інференсу |
| `PYODIDE_CDN_BASE` | URL | Вбудований локальний | URL до Wasm бінарників для автономного режиму |
| `DEMO_ADMIN_PASSWORD` | String | `admin12345` | Пароль первинного адміністратора системи |

---

## 5. Безкоштовний хостинг (Zero-Cost Hosting Options)

1. **Hugging Face Spaces**:
   - Docker SDK шаблон: використовуйте `Dockerfile.api` для інференс-бекенду з CPU Basic (16GB RAM безкоштовно).
2. **Render / Fly.io**:
   - Fast API backend як Web Service (Free Tier або Hobby).
3. **Vercel / Cloudflare Pages**:
   - `apps/web` деплоїться як стандартний Next.js додаток безкоштовно з глобальним CDN.

---

## 6. Резервне копіювання та відновлення даних

### База даних PostgreSQL:
```bash
# Резервна копія
docker exec -t academy-db pg_dump -U postgres academy_v2 > backup_$(date +%Y%m%d).sql

# Відновлення
cat backup_20261030.sql | docker exec -i academy-db psql -U postgres -d academy_v2
```

### SQLite (локальний автономний режим):
```bash
cp academy_v2.db academy_v2_backup.db
```
