from django.urls import path
from . import api

urlpatterns = [
    path("productos/", api.ProductViewSet.as_view({"get": "list"}), name="api_product_list"),
    path("productos/<slug:slug>/", api.ProductViewSet.as_view({"get": "retrieve"}), name="api_product_detail"),
    path("carrito/", api.api_cart_detail, name="api_cart_detail"),
    path("carrito/agregar/<int:product_id>/", api.api_cart_add, name="api_cart_add"),
    path("carrito/remover/<int:product_id>/", api.api_cart_remove, name="api_cart_remove"),
    path("carrito/vaciar/", api.api_cart_clear, name="api_cart_clear"),
    path("auth/csrf/", api.api_csrf_token, name="api_csrf"),
    path("auth/register/", api.api_register, name="api_register"),
    path("auth/login/", api.api_login, name="api_login"),
    path("auth/logout/", api.api_logout, name="api_logout"),
    path("auth/status/", api.api_auth_status, name="api_auth_status"),
    path("ordenes/", api.api_orders, name="api_orders"),
    path("ordenes/<int:order_id>/", api.api_order_detail, name="api_order_detail"),
    path("newsletter/", api.api_newsletter_subscribe, name="api_newsletter_subscribe"),
]
