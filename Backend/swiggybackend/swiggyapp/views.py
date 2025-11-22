# swiggyapp/views.py
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

# SimpleJWT token
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Restaurant, Order, MenuItem
from .serializers import RestaurantSerializer, OrderSerializer

@csrf_exempt
def signup(request):
    """
    Expects JSON: { username, email, phone, password, address }
    Uses create_user() so password is hashed.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone", "")
    address = data.get("address", "")

    if not username or not password or not email:
        return JsonResponse({"error": "username, email and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    # create_user hashes the password correctly
    user = User.objects.create_user(username=username, email=email, password=password)
    # if you have extra profile fields, create them here (e.g., in a related model)
    return JsonResponse({"message": "Signup successful"}, status=201)


@csrf_exempt
def login_view(request):
    """
    Expects JSON: { username, password }
    Returns: { access, refresh } when credentials are valid
    """
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"error": "username and password required"}, status=400)

    # authenticate will check hashed password correctly
    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    # create JWT tokens
    refresh = RefreshToken.for_user(user)
    return JsonResponse({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "username": user.username,
        "email": user.email
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_list(request):
    restaurants = Restaurant.objects.all()
    
    # Filter by Cuisine
    cuisine = request.query_params.get('cuisine')
    if cuisine:
        restaurants = restaurants.filter(cuisine__iexact=cuisine)
        
    # Filter by Search Query
    query = request.query_params.get('search')
    if query:
        restaurants = restaurants.filter(name__icontains=query)

    serializer = RestaurantSerializer(restaurants, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_detail(request, pk):
    try:
        restaurant = Restaurant.objects.get(pk=pk)
    except Restaurant.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = RestaurantSerializer(restaurant)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, pk):
    try:
        order = Order.objects.get(pk=pk, user=request.user)
    except Order.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = OrderSerializer(order)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
