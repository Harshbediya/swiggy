# swiggyapp/views.py
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# SimpleJWT token
from rest_framework_simplejwt.tokens import RefreshToken

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
    })
