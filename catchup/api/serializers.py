from rest_framework import serializers
from .models import Quotes

class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotes
        fields = ["quote_id", "server_id", "quote", "author", "date_quoted"]