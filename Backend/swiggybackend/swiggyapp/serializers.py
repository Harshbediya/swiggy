from rest_framework import serializers
from .models import Restaurant, MenuItem, Order, OrderItem, Address

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)
    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(), source='menu_item', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_id', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_in = serializers.ListField(child=serializers.DictField(), write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'restaurant', 'total_amount', 'status', 'delivery_address', 'created_at', 'items', 'items_in']
        read_only_fields = ['user', 'total_amount', 'status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items_in')
        order = Order.objects.create(**validated_data)
        
        total = 0
        for item_data in items_data:
            menu_item = MenuItem.objects.get(id=item_data['menu_item_id'])
            quantity = item_data['quantity']
            price = menu_item.price * quantity
            total += price
            OrderItem.objects.create(order=order, menu_item=menu_item, quantity=quantity, price=menu_item.price)
        
        order.total_amount = total
        order.save()
        return order
