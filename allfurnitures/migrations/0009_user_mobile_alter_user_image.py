# Generated by Django 4.2.1 on 2023-10-11 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('allfurnitures', '0008_user_image_user_orders'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='mobile',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(default='allfurnitures/users/default.jpg', upload_to='users'),
        ),
    ]
