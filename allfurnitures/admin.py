from django.contrib import admin
from .models import User, Furniture,Cart,Comments
# Register your models here.

admin.site.register(User)
admin.site.register(Furniture)
admin.site.register(Cart)
admin.site.register(Comments)