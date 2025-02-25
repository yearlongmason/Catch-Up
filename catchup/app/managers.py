from django.contrib.auth import models
import datetime


class DiscordUserOAuth2Manager(models.UserManager):
    def create_new_discord_user(self, user):
        discord_tag = '%s#%s' % (user['username'], user['discriminator'])
        new_user = self.create(
            id=user['id'],
            avatar=user['avatar'],
            public_flags=user['public_flags'],
            flags=user['flags'],
            locale=user['locale'],
            mfa_enabled=True,
            discord_tag=discord_tag,
            last_login = datetime.date.today(),
            access_token = user["access_token"]
            
        )
        return new_user