.PHONY: all dev test init-db build clean

PYTHON = .venv/bin/python3
PYTEST = .venv/bin/pytest

all: test build

dev-backend:
	PYTHONPATH=. $(PYTHON) -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000

dev-frontend:
	cd frontend && pnpm dev

test:
	PYTHONPATH=. $(PYTEST) backend/tests/ -v

init-db:
	PYTHONPATH=. $(PYTHON) -m backend.app.core.init_db

build:
	cd frontend && pnpm build

clean:
	rm -rf .pytest_cache frontend/.next
