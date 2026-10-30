# ІНСТРУКЦІЯ З РОЗГОРТАННЯ ТА ЕКСПЛУАТАЦІЇ (DEPLOYMENT GUIDE)
## AI Engineering Academy — Production Infrastructure Specification

**Версія:** 2.0 | 30 жовтня 2026  
**Орієнтовне навантаження:** 100-500 одночасних студентів  

---

### 1. Системні вимоги до сервера

| Компонент | Мінімальні вимоги (Free/Dev) | Рекомендовані (Production 500 CCU) |
|:---|:---|:---|
| **CPU** | 4 ядра (x86_64 або Apple Silicon / ARM64) | 16 ядер (3.2+ GHz) |
| **RAM** | 8 GB | 32 GB ECC RAM |
| **Диск** | 50 GB NVMe SSD | 250 GB NVMe SSD (IOPS > 5000) |
| **ОС** | Ubuntu 24.04 LTS / macOS 14+ | Ubuntu 24.04 LTS / Debian 12 |
| **Docker** | Docker Engine 26+, Docker Compose v2 | Docker Engine 26+, Compose v2 |

---

### 2. Швидкий запуск у Docker Compose

#### Крок 1. Клонування репозиторію та конфігурація оточення
```bash
git clone https://github.com/synthetix-dev/AI-Engineering-Academy.git
cd AI-Engineering-Academy
cp .env.example .env
```
Відредагуйте `.env` та встановіть надійні випадкові значення:
- `POSTGRES_PASSWORD` (мінімум 24 символи)
- `SECRET_KEY` (мінімум 32 випадкових байти)
- `NEXT_PUBLIC_API_URL=https://academy.yourdomain.com/api/v1`

#### Крок 2. Збірка та запуск сервісів
```bash
docker compose up -d --build
```

#### Крок 3. Перевірка статусу працездатності (Healthchecks)
```bash
docker compose ps
curl -s http://127.0.0.1:8000/health
# Відповідь: {"status":"healthy"}
```

---

### 3. Архітектура мережевої безпеки (Topology)

- **Зовнішній доступ:** Відкрито виключно порти 80/443 на Nginx / Caddy зворотньому проксі.
- **Внутрішні сервіси:**
  - `postgres` (pgvector): Доступний лише всередині мережі `ai_academy_network` або на `127.0.0.1:5432`.
  - `redis`: Доступний лише всередині приватної мережі або на `127.0.0.1:6379`.
  - `backend`: REST API сервіс (Uvicorn).
  - `worker`: Фоновий асинхронний воркер ML-задач.
  - `frontend`: Next.js 14 SSR/SSG веб-інтерфейс (порт 3000).

---

### 4. Моніторинг та телеметрія
- Ендпоінт здоров'я: `GET /health`
- Адміністративна телеметрія: `GET /api/v1/admin/telemetry` (CPU, активні воркери, розмір черги Redis, обсяг бази)
- Стрімінг подій виконання: `GET /api/v1/runs/{id}/stream` (Server-Sent Events)
