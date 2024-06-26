from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    wishlist = models.ManyToManyField("Furniture", blank=True, related_name="wishlists")
    image = models.ImageField(upload_to='users', default='allfurnitures/users/default.jpg')
    mobile=models.CharField(max_length=10,blank=True)
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "image": self.image.url,
            "mobile": self.mobile,
            "email": self.email,
        }

class Furniture(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='furnitures', default='allfurnitures/furnitures/default.jpg')
    category = models.CharField(max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="furnitures")
    date = models.DateTimeField(auto_now_add=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "category": self.category,
            "image": self.image.url,
            "user": self.user.username,
            "date": self.date.strftime("%b %d %Y, %I:%M %p"),
            "rating": self.rating
        }

    def __str__(self):
        return f"{self.name} - {self.price} - {self.description} - {self.category}"

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="carts")
    furniture = models.ForeignKey(Furniture, on_delete=models.CASCADE, related_name="carts")
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - {self.furniture.name} - {self.quantity}"
    
class Comments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    furniture = models.ForeignKey(Furniture, on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.furniture.name} - {self.date.strftime('%b %d %Y, %I:%M %p')}"
    
class Orders(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    furniture = models.ForeignKey(Furniture, on_delete=models.CASCADE, related_name="orders")
    quantity = models.IntegerField(default=1)
    date = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "furniture": self.furniture.name,
            "quantity": self.quantity,
            "date": self.date.strftime("%b %d %Y, %I:%M %p"),
            "image": self.furniture.image.url,
            "price": self.furniture.price

        }

    def __str__(self):
        return f"{self.user.username} - {self.furniture.name} - {self.quantity} - {self.date.strftime('%b %d %Y, %I:%M %p')}"
