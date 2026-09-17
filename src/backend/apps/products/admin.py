from django.contrib import admin
from .models import Product, ProductImage, Subscriber, Order, OrderItem


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ["image_url", "alt_text", "order"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ["name", "category", "price", "stock", "is_limited_edition", "created_at"]
    list_filter = ["category", "is_limited_edition"]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}
    date_hierarchy = "created_at"
    list_editable = ["stock"]
    fieldsets = [
        ("Información básica", {"fields": ["name", "slug", "category", "description"]}),
        ("Precio y stock", {"fields": ["price", "material", "stock"]}),
        ("Adicional", {"fields": ["image_url", "is_limited_edition"]}),
    ]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ["product", "price", "quantity", "size", "total"]
    extra = 0

    def has_add_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ["id", "customer", "status", "total_display", "paid", "created_at"]
    list_filter = ["status", "paid", "created_at"]
    search_fields = ["first_name", "last_name", "email"]
    date_hierarchy = "created_at"
    readonly_fields = ["user", "created_at", "updated_at"]
    actions = ["mark_paid", "mark_shipped", "mark_delivered", "mark_cancelled"]
    fieldsets = [
        ("Cliente", {"fields": ["first_name", "last_name", "email", "phone"]}),
        ("Dirección", {"fields": ["address", "city", "postal_code", "province"]}),
        ("Estado", {"fields": ["status", "paid", "notes", "user"]}),
        ("Fechas", {"fields": ["created_at", "updated_at"]}),
    ]

    def customer(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    customer.short_description = "Cliente"

    def total_display(self, obj):
        return f"${obj.get_total()}"
    total_display.short_description = "Total"

    def mark_paid(self, request, queryset):
        queryset.update(paid=True, status=Order.Status.PAID)
    mark_paid.short_description = "Marcar como pagado"

    def mark_shipped(self, request, queryset):
        queryset.update(status=Order.Status.SHIPPED)
    mark_shipped.short_description = "Marcar como enviado"

    def mark_delivered(self, request, queryset):
        queryset.update(status=Order.Status.DELIVERED)
    mark_delivered.short_description = "Marcar como entregado"

    def mark_cancelled(self, request, queryset):
        queryset.update(status=Order.Status.CANCELLED)
    mark_cancelled.short_description = "Cancelar órdenes"


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ["email", "is_active", "created_at"]
    list_filter = ["is_active"]
    search_fields = ["email"]
    date_hierarchy = "created_at"
    actions = ["mark_active", "mark_inactive"]

    def mark_active(self, request, queryset):
        queryset.update(is_active=True)
    mark_active.short_description = "Activar seleccionados"

    def mark_inactive(self, request, queryset):
        queryset.update(is_active=False)
    mark_inactive.short_description = "Desactivar seleccionados"
