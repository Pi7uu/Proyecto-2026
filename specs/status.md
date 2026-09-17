# Estado de tareas — Lustre & Lineage

Actualizado: 2026-09-17. Rama: `refactor/spa-unica`.

## Completadas

| # | Tarea | Estado | Evidencia |
|---|---|---|---|
| 1 | P1 — `services.create_order_from_cart` atómica (`select_for_update`) usada por la API | ✅ | `src/backend/apps/products/services.py`, tests 5/5 OK |
| 2 | Fix `Cart.clear()` (rompía con carrito vacío) | ✅ | `src/backend/apps/products/cart.py` |
| 3 | P0 — Django solo `/api/` + `/admin/` + fallback SPA | ✅ | `src/backend/config/urls.py`, `serve_spa` |
| 4 | Paridad React: newsletter en Home, recomendados en ProductDetail | ✅ | `src/frontend/src/pages/`, `api/newsletter.js` |
| 5 | Servir build con WhiteNoise + `collectstatic` | ✅ | 162 archivos, 468 post-procesados |
| 6 | Fix pantalla en blanco (`base` condicional Vite: `/static/` build, `/` dev) | ✅ | bundle 311 KB servido, API 200, dev 200 |
| 7 | Reorganización `src/backend` + `src/frontend` (con `git mv`) | ✅ | historial preservado como renombres |
| 8 | Organización backend: `config/`, `apps/products/`, `db/`, `tools/` | ✅ | `check` OK, sin migraciones nuevas |
| 9 | Limpieza: endpoints muertos (`carrito/vaciar/`, `auth/csrf/`), `clearCart`, `getCsrfToken`, `public/`, README boilerplate, `templates/`, legacy a `docs/prototipos/` | ✅ | `oxlint` limpio, tests OK |
| 10 | Docs: `README.md`, `AGENTS.md`, `overview.md`, `docs/architecture.md`, `.env.example`, `.gitignore` | ✅ | — |
| 11 | Config por entorno (`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`) | ✅ | `check` OK en dev y prod |
| 12 | Push rama `refactor/spa-unica` a origin | ✅ | commit `5fcd351` |

## Pendientes

| # | Tarea | Estado | Nota |
|---|---|---|---|
| 13 | Abrir el Pull Request contra `main` | ⏳ | manual: `https://github.com/Pi7uu/Proyecto-2026/pull/new/refactor/spa-unica` |
| 14 | Borrar dir `frontend/` vacío en raíz | ⏳ | bloqueado por un proceso `node` ajeno; git lo ignora |
| 15 | `SECRET_KEY` real en prod / `db.sqlite3` commiteada / sin CI | ⏳ | deuda conocida, solo dev |
| 16 | `OrderItemSerializer.total` como `SerializerMethodField` explícito | ⏳ | funciona, mejora menor |
