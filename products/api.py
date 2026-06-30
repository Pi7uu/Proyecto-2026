from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Product, Subscriber, Order, OrderItem
from .serializers import ProductListSerializer, ProductDetailSerializer, OrderSerializer, OrderCreateSerializer
from .cart import Cart


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        qs = Product.objects.all()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(description__icontains=search)
        return qs


@api_view(["GET"])
def api_cart_detail(request):
    cart = Cart(request)
    items = []
    for item in cart:
        product = item["product"]
        items.append({
            "product_id": product.id,
            "name": product.name,
            "slug": product.slug,
            "image_url": product.image_url,
            "price": str(product.price),
            "size": item.get("size"),
            "quantity": item["quantity"],
            "total_price": str(item["total_price"]),
        })
    return Response({
        "items": items,
        "total_items": len(cart),
        "total_price": str(cart.get_total_price()),
    })


@api_view(["POST"])
def api_cart_add(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    size = request.data.get("size")
    quantity = request.data.get("quantity", 1)
    cart.add(product=product, quantity=int(quantity), size=size)
    return Response({"message": "Product added to cart"}, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
def api_cart_remove(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    size = request.query_params.get("size")
    cart.remove(product, size=size)
    return Response({"message": "Product removed from cart"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def api_cart_clear(request):
    cart = Cart(request)
    cart.clear()
    return Response({"message": "Cart cleared"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@ensure_csrf_cookie
def api_auth_status(request):
    user = request.user
    return Response({
        "is_authenticated": user.is_authenticated,
        "username": user.username if user.is_authenticated else None,
        "email": user.email if user.is_authenticated else None,
    })


@api_view(["GET"])
@ensure_csrf_cookie
def api_csrf_token(request):
    return Response({"message": "CSRF cookie set"})


@api_view(["GET", "POST"])
def api_orders(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return Response({"error": "Autenticación requerida"}, status=status.HTTP_401_UNAUTHORIZED)
        qs = Order.objects.filter(user=request.user)
        return Response(OrderSerializer(qs, many=True).data)

    serializer = OrderCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    cart = Cart(request)
    if len(cart) == 0:
        return Response({"error": "El carrito está vacío"}, status=status.HTTP_400_BAD_REQUEST)

    for item in cart:
        product = item["product"]
        if product.stock < item["quantity"]:
            return Response(
                {"error": f"Stock insuficiente para {product.name}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    order = serializer.save(user=request.user if request.user.is_authenticated else None)

    for item in cart:
        product = item["product"]
        OrderItem.objects.create(
            order=order,
            product=product,
            price=product.price,
            quantity=item["quantity"],
            size=item.get("size"),
        )
        product.stock -= item["quantity"]
        product.save()

    cart.clear()
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def api_order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    if not request.user.is_authenticated or (order.user and order.user != request.user):
        return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
    return Response(OrderSerializer(order).data)


@api_view(["POST"])
def api_register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    first_name = request.data.get("first_name", "")
    last_name = request.data.get("last_name", "")

    if not username or not password:
        return Response({"error": "Username y password son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "El usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        email=email or "",
        password=password,
        first_name=first_name,
        last_name=last_name,
    )
    login(request, user)
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def api_login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username y password son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })
    return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def api_logout(request):
    logout(request)
    return Response({"message": "Sesión cerrada"})


@api_view(["POST"])
def api_newsletter_subscribe(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    _, created = Subscriber.objects.get_or_create(email=email)
    if created:
        return Response({"message": "Suscripción exitosa"}, status=status.HTTP_201_CREATED)
    return Response({"message": "Ya estás suscripto"}, status=status.HTTP_200_OK)
