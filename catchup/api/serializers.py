from rest_framework import serializers
from django.apps import apps

class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = apps.get_model('app', 'Quotes')
        fields = ["quote_id", "server_id", "quote", "author", "date_quoted"]
    

class IdSerializer(serializers.ModelSerializer):
    class Meta:
        model = apps.get_model('app', 'Quotes')
        fields = ["quote_id"]