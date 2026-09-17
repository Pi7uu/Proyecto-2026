from rest_framework import serializers
from .models import Product, ProductImage, Order, OrderItem


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "alt_text", "order"]


class ProductListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "category_display",
            "price",
            "material",
            "image_url",
            "is_limited_edition",
            "stock",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.CharField(source="product.image_url", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "product_image", "price", "quantity", "size", "total"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id", "first_name", "last_name", "email", "phone",
            "address", "city", "postal_code", "province", "notes",
            "status", "paid", "items", "total", "created_at", "updated_at",
        ]

    def get_total(self, obj):
        return obj.get_total()


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "first_name", "last_name", "email", "phone",
            "address", "city", "postal_code", "province", "notes",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "category_display",
            "description",
            "price",
            "material",
            "image_url",
            "images",
            "is_limited_edition",
            "stock",
            "created_at",
            "updated_at",
        ]
