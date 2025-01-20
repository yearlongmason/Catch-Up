from django.contrib.auth.backends import BaseBackend
from . import models

class DiscordAuthenticationBackend(BaseBackend):
    def authenticate(self, request, user) -> models.DiscordUser:
        find_user = models.DiscordUser.objects.filter(id=user['id'])
        if len(find_user) == 0:
            print("User was not found. Saving...")
            new_user = models.DiscordUser.objects.create_new_discord_user(user)
            print(new_user)
            return new_user
        return find_user
    
    def get_user(self, user_id):
        try:
            return models.DiscordUser.objects.get(pk=user_id)
        except models.DiscordUser.DoesNotExist:
            return None