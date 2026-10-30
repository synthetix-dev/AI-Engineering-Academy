#!/usr/bin/env bash
set -euo pipefail

# Database Restore Script for AI Engineering Academy
if [ $# -lt 1 ]; then
  echo "Usage: $0 <path_to_backup_file.sql.gz>"
  exit 1
fi

BACKUP_FILE="$1"
if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file '${BACKUP_FILE}' does not exist."
  exit 1
fi

DB_HOST="${POSTGRES_HOST:-127.0.0.1}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-ai_academy}"

echo "==> Restoring database '${DB_NAME}' from '${BACKUP_FILE}'..."
PGPASSWORD="${POSTGRES_PASSWORD:-postgrespassword}" gunzip -c "${BACKUP_FILE}" | psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}"

echo "==> Database restore completed successfully."
