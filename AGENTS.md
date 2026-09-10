# AGENTS.md

## Architecture

Django backend + React (Vite) frontend, dual-rendered: Django templates serve SSR pages, React SPA provides `/cart`, `/login`, `/register`, `/orders`.

- **Backend:** `lumina_silver/` (Django project), `products/` (main app)
- **Frontend:** `frontend/` (React, Vite, Tailwind CSS v4, oxlint)
- **Database:** SQLite (`db.sqlite3`), seed via `products/fixtures/initial_data.json`
- **Locale:** Spanish (`es-AR`), all UI text and API messages in Spanish

## Dev Commands

### Backend (Django)

```bash
# Run dev server (port 8000)
python manage.py runserver

# Migrations
python manage.py makemigrations
python manage.py migrate

# Load seed data
python manage.py loaddata products/fixtures/initial_data.json

# Django shell
python manage.py shell
```

### Frontend (React/Vite)

```bash
# Run dev server (port 5173, proxies /api to :8000)
cd frontend && npm run dev

# Lint (oxlint, no ESLint)
cd frontend && npm run lint

# Build
cd frontend && npm run build
```

## Key Quirks

- **CSRF is disabled** for the API: `products/auth.py` uses `CsrfExemptSessionAuthentication`. The frontend does NOT send CSRF tokens.
- **No test suite** exists yet (`products/tests.py` is empty).
- **No CI/CD** or pre-commit hooks configured.
- Product images are external URLs (Google hosting), not local files.
- Cart uses Django sessions (`CART_SESSION_ID = "cart"`).
- CORS allows `localhost:5173` and `localhost:3000` with credentials.
- `requirements.txt` has no `pip-tools` or lockfile — install directly.
