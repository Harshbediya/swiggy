# swiggyapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('restaurants/', views.restaurant_list, name='restaurant-list'),
    path('restaurants/<int:pk>/', views.restaurant_detail, name='restaurant-detail'),
    path('orders/', views.create_order, name='create-order'),
    path('orders/<int:pk>/', views.order_detail, name='order-detail'),
    path('my-orders/', views.user_orders, name='user-orders'),
]
