# Generated by Django 5.1.4 on 2025-02-01 21:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_discorduser_access_token_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='quotes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_quoted', models.DateField()),
            ],
        ),
    ]
