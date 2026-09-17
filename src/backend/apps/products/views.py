from django.conf import settings
from django.http import FileResponse, HttpResponse


def serve_spa(request):
    """Sirve el build de React (src/frontend/dist/index.html).

    Django ya no renderiza SSR: es API (/api/) + admin + host estático.
    En desarrollo se puede usar `cd src/frontend && npm run dev` (:5173);
    en producción se sirve el resultado de `npm run build`.
    """
    index_path = settings.FRONTEND_DIST_DIR / "index.html"
    if index_path.exists():
        return FileResponse(open(index_path, "rb"))
    return HttpResponse(
        "Frontend no compilado. Ejecutá <code>cd src/frontend && npm run build</code> "
        "para generar <code>src/frontend/dist/index.html</code>, o usá el dev server "
        "de Vite en http://localhost:5173.",
        status=503,
        content_type="text/html",
    )
