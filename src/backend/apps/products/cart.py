from decimal import Decimal
from django.conf import settings
from .models import Product


class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            cart = self.session[settings.CART_SESSION_ID] = {}
        self.cart = cart

    def _key(self, product_id, size=None):
        return f"{product_id}_{size}" if size else str(product_id)

    def _parse_key(self, key):
        parts = key.split("_", 1)
        product_id = int(parts[0])
        size = parts[1] if len(parts) > 1 else None
        return product_id, size

    def add(self, product, quantity=1, size=None, override_quantity=False):
        key = self._key(product.id, size)
        if key not in self.cart:
            self.cart[key] = {"product_id": product.id, "quantity": 0}
            if size:
                self.cart[key]["size"] = size
        if override_quantity:
            self.cart[key]["quantity"] = quantity
        else:
            self.cart[key]["quantity"] += quantity
        self.save()

    def remove(self, product, size=None):
        key = self._key(product.id, size)
        if key in self.cart:
            del self.cart[key]
            self.save()

    def __iter__(self):
        product_ids = set()
        key_items = []
        for key, item in self.cart.items():
            pid = item.get("product_id")
            if pid is None:
                pid, _ = self._parse_key(key)
            product_ids.add(pid)
            key_items.append((key, item, pid))
        products = Product.objects.filter(id__in=product_ids)
        product_map = {p.id: p for p in products}
        for _, item, pid in key_items:
            product = product_map.get(pid)
            if not product:
                continue
            item["product"] = product
            item["total_price"] = product.price * item["quantity"]
            yield item

    def __len__(self):
        return sum(item["quantity"] for item in self.cart.values())

    def get_total_price(self):
        product_ids = set()
        key_price = []
        for key, item in self.cart.items():
            pid = item.get("product_id")
            if pid is None:
                pid, _ = self._parse_key(key)
            product_ids.add(pid)
            key_price.append((pid, item["quantity"]))
        products = Product.objects.filter(id__in=product_ids)
        price_map = {p.id: p.price for p in products}
        return sum(
            Decimal(qty) * price_map.get(pid, 0)
            for pid, qty in key_price
        )

    def clear(self):
        self.session.pop(settings.CART_SESSION_ID, None)
        self.cart = {}
        self.save()

    def save(self):
        self.session.modified = True
