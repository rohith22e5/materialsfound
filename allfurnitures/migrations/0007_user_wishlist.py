# Generated by Django 4.2.1 on 2023-10-01 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('allfurnitures', '0006_comments'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='wishlist',
            field=models.ManyToManyField(blank=True, related_name='wishlists', to='allfurnitures.furniture'),
        ),
    ]