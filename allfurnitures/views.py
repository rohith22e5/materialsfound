from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
import json
from django.views.decorators.csrf import csrf_exempt
from .models import User, Furniture, Cart, Comments
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.core import serializers

# Create your views here.

def index(request):
    return render(request, "allfurnitures/index.html", {
        "furnitures": Furniture.objects.all()
    })

def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"] # username is the name of the input field in the form
        password = request.POST["password"] # password is the name of the input field in the form
        user = authenticate(request, username=username, password=password) # authenticate() is a built-in function provided by Django
        # If authentication successful, log user in
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        # Else, return login page again with new context
        else:
            return render(request, "allfurnitures/login.html", {
                "message": "Invalid username and/or password."
            })
    # If method is GET, return login page
    else:
        return render(request, "allfurnitures/login.html")
    
def logout_view(request):
    logout(request)
    return render(request, "allfurnitures/logout.html")

def register(request):
    if request.method == "POST":
        # Get username, email, password and confirmation password from the form
        username = request.POST["username"] # username is the name of the input field in the form
        email = request.POST["email"] # email is the name of the input field in the form
        password = request.POST["password"] # password is the name of the input field in the form
        confirmation = request.POST["confirmation"] # confirmation is the name of the input field in the form
        # Ensure password matches confirmation
        if password != confirmation:
            return render(request, "allfurnitures/register.html", {
                "message": "Passwords must match."
            })
        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password) # create_user() is a built-in function provided by Django
            user.save()
        except IntegrityError:
            return render(request, "allfurnitures/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    # If method is GET, return register page
    else:
        return render(request, "allfurnitures/register.html")
    

@login_required
def yourfurniture(request):
    if request.method == "GET":
        return render(request, "allfurnitures/yourfurniture.html", {
            "furnitures": Furniture.objects.filter(user=request.user)
        })
    
@login_required
def addfurniture(request):
    if request.method =='GET':
        return render(request, "allfurnitures/addfurniture.html")
    elif request.method=='POST':
        name = request.POST["name"]
        price = request.POST["price"]
        description = request.POST["description"]
        category = request.POST["category"]
        image = request.FILES.get('image')
        furniture = Furniture(name=name, price=price, description=description, category=category, image=image, user=request.user)
        furniture.save()
        return HttpResponseRedirect(reverse("yourfurniture"))
    else:
        return HttpResponse("Method not allowed")

@login_required
def categories(request):
    if request.method == "GET":
        return render(request, "allfurnitures/categories.html", {
            "furnitures": list(Furniture.objects.values_list('category',flat=True).distinct())
        })
    else:
        return HttpResponse("Method not allowed")
    
@login_required
def cart(request):
    if request.method=="GET":
        carts= request.user.carts.all()
        bill= sum([cart.furniture.price*cart.quantity for cart in carts])
        return render(request, "allfurnitures/cart.html",{
            "carts": request.user.carts.all(),
            "bill": bill
        })
    elif request.method=="POST":
        data = json.loads(request.body)
        furniture_id = data.get("id")
        quantity = data.get("quantity")
        furniture = Furniture.objects.get(id=furniture_id)
        existing_cart_item = Cart.objects.filter(user=request.user, furniture=furniture).first()
        cart = Cart(user=request.user, furniture=furniture, quantity=quantity)
        if existing_cart_item:
    # Item already exists in the cart, so remove it
            existing_cart_item.delete()
            usercarts = request.user.carts.count()
            return JsonResponse({"message": "Removed from cart", "cart_items": usercarts}, status=201)
        # Item doesn't exist in the cart, so add it
        cart.save()
        usercarts = request.user.carts.count()
        return JsonResponse({"message": "Added to cart", "cart_items": usercarts}, status=201)

    
@login_required
def account(request):
    if request.method=="GET":
        if request.content_type == 'application/json':
            return JsonResponse(request.user.serialize())
        else:
            return render(request, "allfurnitures/account.html",{
                "User": request.user
            })
    
@login_required
def furniture(request,furniture_id):
    if request.method=="GET":
        cart=Cart.objects.filter(user=request.user, furniture=Furniture.objects.get(id=furniture_id)).first()
        comments=Furniture.objects.get(id=furniture_id).comments.all()
        comments=comments.order_by("-date").all()
        paginator = Paginator(comments, 5)
        page_number = request.GET.get('page')
        comments = paginator.get_page(page_number)
        furniture=Furniture.objects.get(id=furniture_id)
        if cart:
            return render(request, "allfurnitures/furniture.html",{
                "furniture": Furniture.objects.get(id=furniture_id),
                "change_button": "Remove from cart",
                "comments": comments,
                "color": "red" if furniture in request.user.wishlist.all() else "black"
            })
        else:
         return render(request, "allfurnitures/furniture.html",{
            "furniture": Furniture.objects.get(id=furniture_id),
            "change_button": "Add to cart",
            "color": "red" if furniture in request.user.wishlist.all() else "black",
        })
    else:
        return HttpResponse("Method not allowed")
    
@login_required
def category(request,category):
    if request.method=="GET":
        furnitures=Furniture.objects.filter(category=category)
        furnitures=furnitures.order_by("rating").all()
        return JsonResponse([furniture.serialize() for furniture in furnitures],safe=False)
    else:
        return JsonResponse({"error":"GET request required."},status=400)
    
@login_required
def comment(request):
    if request.method=='POST':
        data=json.loads(request.body)
        id=data.get("id")
        comment_msg=data.get("comment")
        user=request.user
        furniture=Furniture.objects.get(id=id)
        comment=Comments(user=user,furniture=furniture,comment=comment_msg)
        comment.save()
        return JsonResponse({"message":"Comment added successfully"},status=201)
    else:
        return JsonResponse({"error":"POST request required."},status=400)
    
@login_required
def wishlist(request):
    if request.method=="GET":
        return render(request, "allfurnitures/wishlist.html",{
            "wishlists": request.user.wishlist.all()
        })
    elif request.method=="POST":
        data = json.loads(request.body)
        furniture_id = data.get("id")
        furniture = Furniture.objects.get(id=furniture_id)
        existing_wishlist_item = request.user.wishlist.filter(id=furniture_id).first()
        if existing_wishlist_item:
    # Item already exists in the wishlist, so remove it
            request.user.wishlist.remove(furniture)
            return JsonResponse({"message": "Removed from wishlist"}, status=201)
        # Item doesn't exist in the wishlist, so add it
        request.user.wishlist.add(furniture)
        return JsonResponse({"message": "Added to wishlist"}, status=201)
    else:
        return HttpResponse("Method not allowed")