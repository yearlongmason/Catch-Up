from django.shortcuts import render
from rest_framework import generics
from .models import Quotes
from .serializers import QuoteSerializer, IdSerializer
import requests


class QuoteCreate(generics.ListCreateAPIView):
    queryset = Quotes.objects.all()
    serializer_class = QuoteSerializer

class GetID(generics.ListAPIView):
    
    serializer_class = IdSerializer
    def get_queryset(self):
        
        server_id = self.request.data['server_id']
        print(server_id)
        

        return Quotes.objects.filter(server_id = server_id)