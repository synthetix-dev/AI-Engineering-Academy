# ПЛАН МІГРАЦІЇ ТА ВІДНОВЛЕННЯ ДАНИХ (MIGRATION PLAN)
## AI Engineering Academy — Database Versioning & Disaster Recovery

**Версія:** 2.0 | 30 жовтня 2026  
**СУБД:** PostgreSQL 17 + `pgvector` 0.8.2  
**Інструмент міграцій:** Alembic 1.20.1  

---

### 1. Стратегія версіонування схеми даних

Для уникнення race conditions при старті системи (дефект **OPS-006**):
1. **Ініціалізація та міграції** відокремлені від основного контейнера API (`backend`).
2. У `docker-compose.yml` виділено одноразовий сервіс `db_migrate`:
   ```yaml
   db_migrate:
     build: .
     command: ["python", "-m", "backend.app.core.init_db"]
     restart: "no"
   ```
3. Сервіси `backend` та `worker` запускаються **лише після успішного завершення** `db_migrate` (`condition: service_completed_successfully`).

---

### 2. Регламент резервного копіювання (Disaster Recovery)

Створено набір автоматизованих скриптів у каталозі `scripts/`:

#### 2.1. Створення резервної копії (`scripts/backup_db.sh`)
```bash
./scripts/backup_db.sh
```
- Створює стиснений `.sql.gz` дамп усієї БД, включаючи векторні таблиці `vector_documents`.
- Використовує прапорці `--clean --if-exists --no-owner` для забезпечення сумісності з будь-яким цільовим сервером.
- Зберігає резервні копії в каталозі `./backups/` з часовою міткою `YYYYMMDD_HHMMSS`.

#### 2.2. Відновлення з резервної копії (`scripts/restore_db.sh`)
```bash
./scripts/restore_db.sh backups/ai_academy_20261030_185040.sql.gz
```
- Потоково розпаковує та застосовує дамп через утиліту `psql`.
- Зберігає векторні індекси HNSW та партиції.

---

### 3. Процедура Zero-Downtime оновлення (Blue-Green / Rolling)

1. **Крок 1 (Pre-deployment):** Створення знімка стану бази даних через `scripts/backup_db.sh`.
2. **Крок 2 (Migration):** Запуск міграцій додавання нових колонок зі значеннями за замовчуванням (Backward-compatible schema additions).
3. **Крок 3 (Service Rollout):** Оновлення образів контейнерів `backend` та `worker`.
4. **Крок 4 (Post-deployment):** Видалення застарілих невикористовуваних таблиць/колонок у наступному плановому вікні обслуговування.
