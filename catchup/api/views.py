from django.shortcuts import render
from rest_framework import generics
from .serializers import QuoteSerializer, IdSerializer
import requests
from django.apps import apps


class QuoteCreate(generics.ListCreateAPIView):
    Quotes = apps.get_model('app', 'Quotes')
    queryset = Quotes.objects.all()
    serializer_class = QuoteSerializer

class GetID(generics.ListAPIView):
    Quotes = apps.get_model('app', 'Quotes')
    serializer_class = IdSerializer
    def get_queryset(self):
        
        server_id = self.request.data['server_id']
        print(server_id)
        

        return self.Quotes.objects.filter(server_id = server_id)