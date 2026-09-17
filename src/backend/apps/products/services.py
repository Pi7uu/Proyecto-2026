from django.contrib.auth.models import AnonymousUser
from django.db import transaction

from .models import Order, OrderItem, Product


class EmptyCartError(Exception):
    pass


class InsufficientStockError(Exception):
    def __init__(self, product_name, available=None, requested=None):
        self.product_name = product_name
        self.available = available
        self.requested = requested
        super().__init__(f"Stock insuficiente para {product_name}")


def create_order_from_cart(cart, order_data, user=None):
    """Crea una Order + OrderItems desde un Cart de forma atómica.

    Única fuente de verdad para checkout SSR (views.checkout) y API
    (api_orders). Bloquea las filas de Product con select_for_update
    para evitar oversell concurrente, descuenta stock y vacía el carrito.

    - cart: instancia de products.cart.Cart (con sesión viva).
    - order_data: dict ya validado con claves del modelo Order
      (first_name, last_name, email, phone, address, city,
      postal_code, province, notes).
    - user: request.user o None. Los anónimos se guardan como NULL.
    """
    items = list(cart)
    if not items:
        raise EmptyCartError("El carrito está vacío")

    if user is not None and isinstance(user, AnonymousUser):
        user = None
    # get_user_model compatible: cualquier objeto sin pk se trata como anónimo
    if user is not None and getattr(user, "pk", None) is None:
        user = None

    product_ids = list({item["product"].id for item in items})

    with transaction.atomic():
        locked = Product.objects.select_for_update().filter(id__in=product_ids)
        locked_map = {p.id: p for p in locked}

        for item in items:
            product = locked_map.get(item["product"].id)
            if product is None:
                raise InsufficientStockError(item["product"].name)
            if product.stock < item["quantity"]:
                raise InsufficientStockError(
                    product.name,
                    available=product.stock,
                    requested=item["quantity"],
                )

        order = Order.objects.create(user=user, **order_data)

        order_items = []
        for item in items:
            product = locked_map[item["product"].id]
            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    price=product.price,
                    quantity=item["quantity"],
                    size=item.get("size"),
                )
            )
            product.stock -= item["quantity"]
            product.save(update_fields=["stock", "updated_at"])

        OrderItem.objects.bulk_create(order_items)
        cart.clear()
        return order
