from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.http import require_POST
from django.contrib import messages
from .models import Product, Subscriber, Order, OrderItem
from .cart import Cart


def home(request):
    category = request.GET.get("category")
    search = request.GET.get("search")
    products = Product.objects.all()
    if category:
        products = products.filter(category=category)
    if search:
        products = products.filter(name__icontains=search) | products.filter(description__icontains=search)
    return render(request, "products/home.html", {
        "products": products,
        "current_category": category,
        "total_count": Product.objects.count(),
        "search_query": search,
    })


def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    recommended = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
    images = list(product.images.all())
    return render(request, "products/product_detail.html", {
        "product": product,
        "product_images": images,
        "recommended_products": recommended,
        "current_category": product.category,
    })


@require_POST
def cart_add(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    size = request.POST.get("size")
    cart.add(product=product, size=size)
    return redirect(request.META.get("HTTP_REFERER", "cart_detail"))


def cart_remove(request, product_id):
    size = request.GET.get("size")
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.remove(product, size=size)
    return redirect("cart_detail")


def cart_detail(request):
    cart = Cart(request)
    return render(request, "products/cart_detail.html", {"cart": cart, "current_category": None})


@require_POST
def newsletter_subscribe(request):
    email = request.POST.get("email")
    if email:
        Subscriber.objects.get_or_create(email=email)
        messages.success(request, "¡Suscripción exitosa!")
    return redirect(request.META.get("HTTP_REFERER", "home"))


@require_POST
def checkout(request):
    cart = Cart(request)
    if len(cart) == 0:
        messages.error(request, "El carrito está vacío")
        return redirect("cart_detail")

    first_name = request.POST.get("first_name")
    last_name = request.POST.get("last_name")
    email = request.POST.get("email")
    phone = request.POST.get("phone")
    address = request.POST.get("address")
    city = request.POST.get("city")
    postal_code = request.POST.get("postal_code")
    province = request.POST.get("province")

    if not all([first_name, last_name, email, address, city, postal_code, province]):
        messages.error(request, "Completá todos los campos obligatorios")
        return redirect("cart_detail")

    for item in cart:
        product = item["product"]
        if product.stock < item["quantity"]:
            messages.error(request, f"Stock insuficiente para {product.name}")
            return redirect("cart_detail")

    order = Order.objects.create(
        user=request.user if request.user.is_authenticated else None,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone or "",
        address=address,
        city=city,
        postal_code=postal_code,
        province=province,
    )

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
    messages.success(request, f"¡Orden #{order.id} creada con éxito!")
    return redirect("cart_detail")
