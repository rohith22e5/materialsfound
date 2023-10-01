from django.urls import path
from . import views

urlpatterns=[
    path("",views.index,name='index'),
    path("login",views.login_view,name="login"),
    path("logout",views.logout_view,name="logout"),
    path("register",views.register,name="register"),
    path("yourfurniture",views.yourfurniture,name="yourfurniture"),
    path("addfurniture",views.addfurniture,name="addfurniture"),
    path("categories",views.categories,name="categories"),
    path("Cart",views.cart,name="Cart"),
    path("account",views.account,name="Account"),
    path("furniture/<int:furniture_id>",views.furniture,name="furnituredetails"),
    path("categories/<str:category>",views.category,name="category"),
    path("Comment",views.comment,name="Comment"),
    path("wishlist",views.wishlist,name="wishlist"),
]
