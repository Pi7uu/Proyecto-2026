from .cart import Cart
from .models import Product


def cart(request):
    return {"cart": Cart(request)}


def categories(request):
    return {"categories": Product.Category.choices}
