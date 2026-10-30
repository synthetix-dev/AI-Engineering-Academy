#!/usr/bin/env bash
set -euo pipefail

# Database Backup Script for AI Engineering Academy (PostgreSQL + pgvector)
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/ai_academy_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

DB_HOST="${POSTGRES_HOST:-127.0.0.1}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-ai_academy}"

echo "==> Creating cold backup of database '${DB_NAME}' from ${DB_HOST}:${DB_PORT}..."
PGPASSWORD="${POSTGRES_PASSWORD:-postgrespassword}" pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --clean \
  --if-exists \
  --no-owner \
  | gzip > "${BACKUP_FILE}"

echo "==> Backup successfully created at: ${BACKUP_FILE}"
ls -lh "${BACKUP_FILE}"
