from django.shortcuts import render
from rest_framework import generics
from .serializers import QuoteSerializer, IdSerializer, RandomQuoteSerializer
import requests
from django.apps import apps
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import TemplateView
from rest_framework.permissions import IsAuthenticated



class QuoteCreate(generics.ListCreateAPIView):
    #permission_classes = [IsAuthenticated]
    Quotes = apps.get_model('app', 'Quotes')
    queryset = Quotes.objects.all()
    serializer_class = QuoteSerializer


class GetID(generics.ListAPIView):
    #permission_classes = [IsAuthenticated]
    Quotes = apps.get_model('app', 'Quotes')
    serializer_class = IdSerializer
    def get_queryset(self):
        
        server_id = self.request.data['server_id']
        return self.Quotes.objects.filter(server_id = server_id)


class GetRandomQuote(generics.ListAPIView):
    #permission_classes = [IsAuthenticated]
    Quotes = apps.get_model('app', 'Quotes')
    serializer_class = RandomQuoteSerializer

    def get_queryset(self):
        
        server_id = self.request.data['server_id']
        all = self.Quotes.objects.all().filter(server_id = server_id)
        print(all)
        return all