from django.db import models
from .managers import DiscordUserOAuth2Manager

# Create your models here.
class DiscordUser(models.Model):
    objects = DiscordUserOAuth2Manager()
    id = models.BigIntegerField(primary_key=True)
    discord_tag = models.CharField(max_length=100)
    avatar = models.CharField(max_length=100)
    public_flags = models.IntegerField()
    flags = models.IntegerField()
    locale = models.CharField(max_length=100)
    mfa_enabled = models.BooleanField()
    last_login = models.DateTimeField() 
    access_token = models.CharField(max_length=100, default="none")
    is_active = models.BooleanField(default=False)

    def is_authenticated(self, request):
        return True

class Quotes(models.Model):
    quote_id = models.BigIntegerField(primary_key=True, default=None)
    server_id = models.CharField(max_length=20, default=None)
    quote = models.CharField(max_length=280, default=None)
    author = models.CharField(max_length=30, default=None)
    date_quoted = models.DateField(default=None)