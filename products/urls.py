from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("producto/<slug:slug>/", views.product_detail, name="product_detail"),
    path("carrito/", views.cart_detail, name="cart_detail"),
    path("carrito/agregar/<int:product_id>/", views.cart_add, name="cart_add"),
    path("carrito/remover/<int:product_id>/", views.cart_remove, name="cart_remove"),
    path("newsletter/", views.newsletter_subscribe, name="newsletter_subscribe"),
    path("checkout/", views.checkout, name="checkout"),
]
