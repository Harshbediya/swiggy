import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swiggybackend.settings')
django.setup()

from swiggyapp.models import Restaurant, MenuItem

def populate():
    # Clear existing data
    Restaurant.objects.all().delete()
    MenuItem.objects.all().delete()

    restaurants = [
        {
            "name": "Spice Junction",
            "cuisine": "Indian",
            "rating": 4.4,
            "distance_km": 1.2,
            "price_tier": "₹",
            "delivery_time_mins": 25,
            "is_member_exclusive": False,
            "is_value_meal": True,
            "promotions": ["20% OFF"],
            "dietary_options": ["Vegetarian"],
            "menu": [
                {"name": "Butter Chicken", "price": 350, "is_veg": False, "description": "Rich and creamy butter chicken"},
                {"name": "Paneer Tikka", "price": 250, "is_veg": True, "description": "Spicy paneer tikka"},
                {"name": "Naan", "price": 40, "is_veg": True, "description": "Butter naan"}
            ]
        },
        {
            "name": "Wok & Roll",
            "cuisine": "Chinese",
            "rating": 4.2,
            "distance_km": 3.3,
            "price_tier": "₹₹",
            "delivery_time_mins": 35,
            "is_member_exclusive": True,
            "is_value_meal": False,
            "promotions": [],
            "dietary_options": ["Egg-Free"],
            "menu": [
                {"name": "Hakka Noodles", "price": 200, "is_veg": True, "description": "Stir fried noodles"},
                {"name": "Manchurian", "price": 220, "is_veg": True, "description": "Veg manchurian gravy"}
            ]
        },
        {
            "name": "La Pasta",
            "cuisine": "Italian",
            "rating": 4.7,
            "distance_km": 2.0,
            "price_tier": "₹₹₹",
            "delivery_time_mins": 45,
            "is_member_exclusive": True,
            "is_value_meal": True,
            "promotions": ["Free Dessert"],
            "dietary_options": [],
            "menu": [
                {"name": "Alfredo Pasta", "price": 400, "is_veg": True, "description": "Creamy white sauce pasta"},
                {"name": "Margherita Pizza", "price": 450, "is_veg": True, "description": "Classic cheese pizza"}
            ]
        }
    ]

    for r_data in restaurants:
        menu_data = r_data.pop("menu")
        restaurant = Restaurant.objects.create(**r_data)
        print(f"Created Restaurant: {restaurant.name}")
        
        for m_data in menu_data:
            MenuItem.objects.create(restaurant=restaurant, **m_data)
            print(f"  - Created Menu Item: {m_data['name']}")

if __name__ == '__main__':
    populate()
