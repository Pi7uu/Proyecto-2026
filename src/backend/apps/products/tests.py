from django.contrib.auth.models import AnonymousUser, User
from django.contrib.sessions.middleware import SessionMiddleware
from django.test import RequestFactory, TestCase

from .cart import Cart
from .models import Order, Product
from .services import (
    EmptyCartError,
    InsufficientStockError,
    create_order_from_cart,
)

ORDER_DATA = {
    "first_name": "Ada",
    "last_name": "Lovelace",
    "email": "ada@example.com",
    "phone": "1112345678",
    "address": "Calle Falsa 123",
    "city": "Buenos Aires",
    "postal_code": "1000",
    "province": "CABA",
    "notes": "",
}


def make_request(factory):
    request = factory.post("/")
    middleware = SessionMiddleware(lambda req: None)
    middleware.process_request(request)
    request.session.save()
    request.user = AnonymousUser()
    return request


class CreateOrderFromCartTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.product = Product.objects.create(
            name="Anillo Test",
            slug="anillo-test",
            category="anillos",
            description="desc",
            price="100.00",
            material="Plata 925",
            image_url="http://example.com/a.jpg",
            stock=5,
        )

    def _cart_with(self, qty, request=None):
        request = request or make_request(self.factory)
        cart = Cart(request)
        cart.add(product=self.product, quantity=qty)
        return request, cart

    def test_success_creates_order_discounts_stock_and_clears_cart(self):
        request, cart = self._cart_with(2)
        order = create_order_from_cart(cart, dict(ORDER_DATA), user=request.user)

        self.assertEqual(Order.objects.count(), 1)
        self.assertIsNone(order.user)
        self.assertEqual(order.items.count(), 1)
        item = order.items.get()
        self.assertEqual(item.quantity, 2)
        self.assertEqual(str(item.price), "100.00")
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 3)
        self.assertEqual(len(cart), 0)

    def test_empty_cart_raises(self):
        request = make_request(self.factory)
        cart = Cart(request)
        with self.assertRaises(EmptyCartError):
            create_order_from_cart(cart, dict(ORDER_DATA), user=request.user)
        self.assertEqual(Order.objects.count(), 0)

    def test_insufficient_stock_raises_and_rolls_back(self):
        _, cart = self._cart_with(10)
        with self.assertRaises(InsufficientStockError):
            create_order_from_cart(cart, dict(ORDER_DATA), user=None)
        self.assertEqual(Order.objects.count(), 0)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 5)

    def test_authenticated_user_is_attached(self):
        user = User.objects.create_user(username="ada", password="x")
        request = make_request(self.factory)
        request.user = user
        cart = Cart(request)
        cart.add(product=self.product, quantity=1)
        order = create_order_from_cart(cart, dict(ORDER_DATA), user=user)
        self.assertEqual(order.user, user)

    def test_api_orders_end_to_end(self):
        # Carrito vía API + checkout vía API usan el mismo servicio.
        c = self.client
        c.post(
            f"/api/carrito/agregar/{self.product.id}/",
            data={"quantity": 2},
            content_type="application/json",
        )
        resp = c.post("/api/ordenes/", data=ORDER_DATA, content_type="application/json")
        self.assertEqual(resp.status_code, 201, resp.content[:500])
        self.assertEqual(Order.objects.count(), 1)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 3)
