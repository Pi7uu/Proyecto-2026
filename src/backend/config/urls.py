from django.contrib import admin
from django.urls import path, include, re_path
from apps.products import views as spa_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.products.api_urls')),
    # SPA fallback: todo lo que no sea /api/ ni /admin/ lo sirve React.
    # Debe ir último.
    re_path(r'^(?!api/|admin/|static/).*$', spa_views.serve_spa, name='spa'),
]
