from django.contrib.auth.backends import BaseBackend
from . import models

class DiscordAuthenticationBackend(BaseBackend):
    def authenticate(self, request, user) -> models.DiscordUser:
        find_user = models.DiscordUser.objects.filter(id=user['id'])
        if len(find_user) == 0:
            print("User was not found. Saving...")