# Arquitectura — Lustre & Lineage

E-commerce de joyería en plata 925. Ver propósito en `../overview.md`
y sistema de diseño en `../DESIGN.md`.

## 1. Visión general

```
┌──────────────┐      /api/*       ┌──────────────────┐
│  React SPA   │ ────────────────▶ │  Django + DRF    │
│  (Vite)      │ ◀──────────────── │  API + estáticos │
└──────────────┘   JSON + sesión   └────────┬─────────┘
      ▲                                      │ SQL
      │ sirve build compilado                ▼
      │                            ┌──────────────────┐
      └────────────────────────────│  SQLite          │
         src/frontend/dist         └──────────────────┘
```

- **Frontend:** React SPA (Vite). Toda la UI y el ruteo viven acá.
- **Backend:** Django + DRF. Expone solo `/api/`, `/admin/` y el fallback
  SPA. No genera HTML salvo `src/frontend/dist/index.html`.
- **DB:** SQLite (`src/backend/db/db.sqlite3`).
- **Carrito:** en sesión Django (`CART_SESSION_ID = "cart"`), compartido
  por web y API vía cookie de sesión.
- **Idioma:** español (`es-AR`) en UI y mensajes.

## 2. Estructura de carpetas

```
src/
  backend/
    manage.py  requirements.txt
    config/               proyecto Django: settings, urls, wsgi/asgi
    apps/products/        única app: modelos, API, servicios, admin
      models.py           Product, ProductImage, Subscriber, Order, OrderItem
      api.py / api_urls.py  endpoints REST bajo /api/
      services.py         create_order_from_cart (única fuente de verdad)
      cart.py             carrito en sesión
      auth.py             CsrfExemptSessionAuthentication
      serializers.py      serializers DRF
      views.py            serve_spa (fallback, no hay SSR)
      admin.py            admin de productos, órdenes y suscriptores
      fixtures/           initial_data.json (seed)
    db/                   db.sqlite3
    tools/                scripts de mantenimiento (ver su README)
    static/               estáticos propios (vacío por ahora)
  frontend/
    index.html            entrada HTML (<div id="root">)
    vite.config.js        base condicional: / en dev, /static/ en build
    src/
      main.jsx            monta la app en #root
      App.jsx             rutas del BrowserRouter
      pages/              Home, ProductDetail, Cart, Login, Register, Orders
      components/         Navbar, Footer, ProductCard, ProtectedRoute
      context/            AuthContext (sesión), CartContext (carrito)
      api/                client axios (/api) + products, cart, orders,
                          auth, newsletter
      index.css           Tailwind CSS v4
docs/
  architecture.md         este archivo
  prototipos/             maquetas HTML originales (referencia, sin uso)
```

## 3. Backend (`src/backend/`)

Se corre desde `src/backend/` (`python manage.py runserver`).

### 3.1. `config/` — puerta de entrada

- `settings.py`: `BASE_DIR = src/backend`. `FRONTEND_DIST_DIR =
  src/frontend/dist` se agrega a `STATICFILES_DIRS`; `STATIC_ROOT =
  src/backend/staticfiles` con WhiteNoise para producción.
- `urls.py`: `admin/`, `api/` y el catch-all SPA
  (`r'^(?!api/|admin/|static/).*$'` → `serve_spa`). El orden importa:
  el fallback va último.
- Configuración sensible por entorno (ver `../.env.example`):
  `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`.

### 3.2. `apps/products/` — la aplicación

**Modelos** (`models.py`):

| Modelo | Rol |
|---|---|
| `Product` | Pieza del catálogo (categoría, precio, stock, `image_url` externa, `is_limited_edition`, `slug`) |
| `ProductImage` | Galería por producto (`order` define el orden) |
| `Subscriber` | Emails del newsletter (`is_active`) |
| `Order` / `OrderItem` | Orden con datos de envío + líneas (precio congelado al comprar, `size` opcional) |

**API** (`api.py`, rutas en `api_urls.py`, prefijo `/api/`):

| Método | Ruta | Descripción |
|---|---|---|
| GET | `productos/?category=&search=&page=` | Catálogo paginado (20 por página) |
| GET | `productos/<slug>/` | Detalle + galería |
| GET/POST | `carrito/` (GET), `carrito/agregar/<id>/`, `carrito/remover/<id>/` | Carrito en sesión |
| GET/POST | `ordenes/`, GET `ordenes/<id>/` | Crear (con carrito) y listar (requiere login para GET) |
| POST | `auth/register/`, `auth/login/`, `auth/logout/` | Auth por sesión |
| GET | `auth/status/` | Estado de sesión para el frontend |
| POST | `newsletter/` | Suscripción (idempotente) |

**Checkout** (`services.py`): `create_order_from_cart(cart, order_data,
user)` es la única vía para crear órdenes. Materializa el carrito,
bloquea los `Product` con `select_for_update()` dentro de
`transaction.atomic()`, valida stock, crea `Order` + `OrderItem`
(`bulk_create`), descuenta stock y vacía el carrito. Errores
tipados: `EmptyCartError`, `InsufficientStockError`.

**Auth y CSRF**: la API usa sesión sin CSRF
(`CsrfExemptSessionAuthentication`); el cliente axios va con
`withCredentials: true` y el proxy de Vite reenvía `/api` a Django.
CORS permite `localhost:5173`/`3000` (y `127.0.0.1`) con credenciales.

### 3.3. `db/` y `tools/`

- `db/db.sqlite3`: base de desarrollo (trackeada en git por ahora).
  Seed: `python manage.py loaddata apps/products/fixtures/initial_data.json`.
- `tools/`: scripts standalone de mantenimiento (reglas en su README).

## 4. Frontend (`src/frontend/`)

Se corre desde `src/frontend/` (`npm run dev`, puerto 5173).

### 4.1. Ruteo (`App.jsx`)

| Ruta | Página | Acceso |
|---|---|---|
| `/` | `Home` (hero, filtros por categoría, grilla, newsletter) | público |
| `/producto/:slug` | `ProductDetail` (galería, talles, recomendados) | público |
| `/cart` | `Cart` (líneas, totales, formulario de envío → `POST /api/ordenes/`) | público |
| `/login`, `/register` | Auth por sesión | público |
| `/orders` | Historial del usuario | `ProtectedRoute` (login) |

`Navbar`/`Footer` envuelven todas las rutas.

### 4.2. Estado y datos

- `AuthContext`: consulta `GET /api/auth/status/` al montar; expone
  `user`, `logout`, `checkAuth`.
- `CartContext`: espejo del carrito del servidor (`GET /api/carrito/`);
  `add`/`remove` mutan vía API y re-sincronizan.
- `api/*.js`: una función por endpoint; `client.js` fija
  `baseURL: "/api"` (en dev lo proxyea Vite, en prod es el mismo origen).

### 4.3. Build y `base` condicional (`vite.config.js`)

```js
base: command === "build" ? "/static/" : "/"
```

- En **dev** (`/`) la app vive en `localhost:5173/` y React Router
  funciona directo.
- En **build** los assets cuelgan de `/static/`, que es lo único que
  Django/WhiteNoise sabe servir. Sin esto, el fallback SPA devolvía
  `index.html` en lugar del JS y la página quedaba en blanco.

## 5. Flujos principales

**Catálogo:** `Home` → `GET /api/productos/?category=` (paginado) →
grilla de `ProductCard` → `ProductDetail` (`GET /api/productos/<slug>/`
+ recomendados de la misma categoría).

**Carrito:** `add(productId, {size})` → `POST /api/carrito/agregar/` →
`fetchCart()` re-sincroniza. El carrito vive en la sesión del servidor;
el contexto React es solo un espejo.

**Checkout:** formulario en `Cart` → `POST /api/ordenes/` con datos de
envío → `services.create_order_from_cart` (atómico) → carrito vacío +
orden creada. Sin stock: 400 `"Stock insuficiente para …"`.

**Auth:** `Login`/`Register` hacen POST, Django crea la cookie de
sesión; `AuthContext` la detecta vía `/api/auth/status/`. `/orders`
lista solo las órdenes del usuario logueado.

**Newsletter:** formulario en `Home` → `POST /api/newsletter/`
(idempotente: distingue alta de "ya suscripto").

## 6. Ambientes

### Desarrollo (dos terminales)

```bash
cd src/backend && python manage.py runserver      # :8000 API + build
cd src/frontend && npm run dev                    # :5173 app en vivo
```

Abrir `http://localhost:5173` (Vite escucha en `localhost`, no en
`127.0.0.1`). El `:8000` sirve el último build + API + `/admin/`.

### Producción

```bash
cd src/frontend && npm run build
cd ../backend && python manage.py collectstatic
DJANGO_DEBUG=False DJANGO_SECRET_KEY=<clave> \
  DJANGO_ALLOWED_HOSTS=<dominio> python manage.py runserver
```

Un solo origen sirve todo: la SPA, `/static/` (WhiteNoise) y `/api/`.

## 7. Calidad

- Backend: `python manage.py test apps.products.tests` (servicio de
  órdenes: éxito, carrito vacío, rollback por stock, usuario
  anónimo/autenticado, end-to-end API).
- Frontend: `npx oxlint` (sin ESLint).
- Decisiones ya tomadas: SPA única (se eliminó el SSR duplicado),
  checkout en un solo servicio atómico, assets bajo `/static/`.

## 8. Deuda conocida

- `SECRET_KEY` de desarrollo en código como default; en prod debe
  venir siempre de `DJANGO_SECRET_KEY`.
- `db.sqlite3` commiteada: práctica solo para desarrollo.
- Sin CI/CD ni pre-commit hooks.
- `OrderItemSerializer.total` expone el método del modelo; funciona,
  pero convendría un `SerializerMethodField` explícito.
