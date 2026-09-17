# AGENTS.md

> Project purpose: see `overview.md`.

## Architecture

Django backend + React (Vite) frontend: React SPA única (servida por Django desde `src/frontend/dist`), Django expone solo `/api/`, `/admin/` y el fallback SPA. El checkout usa `src/backend/apps/products/services.py` como única fuente de verdad.

- **Backend:** `src/backend/config/` (proyecto Django), `src/backend/apps/products/` (main app), `src/backend/db/` (SQLite), `src/backend/tools/` (scripts) — correr Django desde `src/backend/`
- **Frontend:** `src/frontend/` (React, Vite, Tailwind CSS v4, oxlint)
- **Database:** SQLite (`src/backend/db/db.sqlite3`), seed via `apps/products/fixtures/initial_data.json`
- **Locale:** Spanish (`es-AR`), all UI text and API messages in Spanish

## Dev Commands

### Backend (Django — correr desde `src/backend/`)

```bash
# Run dev server (port 8000)
python manage.py runserver

# Migrations
python manage.py makemigrations
python manage.py migrate

# Load seed data
python manage.py loaddata apps/products/fixtures/initial_data.json

# Django shell
python manage.py shell
```

### Frontend (React/Vite)

```bash
# Run dev server (port 5173, proxies /api to :8000)
cd src/frontend && npm run dev

# Lint (oxlint, no ESLint)
cd src/frontend && npm run lint

# Build
cd src/frontend && npm run build
```

## Key Quirks

- **CSRF is disabled** for the API: `src/backend/apps/products/auth.py` uses `CsrfExemptSessionAuthentication`. The frontend does NOT send CSRF tokens.
- **Tests:** `src/backend/apps/products/tests.py` cubre `services.create_order_from_cart` + API de órdenes (`python manage.py test apps.products.tests` desde `src/backend/`).
- **No CI/CD** or pre-commit hooks configured.
- Product images are external URLs (Google hosting), not local files.
- Cart uses Django sessions (`CART_SESSION_ID = "cart"`).
- CORS allows `localhost:5173` and `localhost:3000` with credentials.
- `requirements.txt` has no `pip-tools` or lockfile — install directly.
