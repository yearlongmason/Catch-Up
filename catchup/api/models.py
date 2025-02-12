from django.db import models

class Quotes(models.Model):
    quote_id = models.BigIntegerField(primary_key=True, default=None)
    server_id = models.CharField(max_length=20, default=None)
    quote = models.CharField(max_length=280, default=None)
    author = models.CharField(max_length=30, default=None)
    date_quoted = models.DateField(default=None)

