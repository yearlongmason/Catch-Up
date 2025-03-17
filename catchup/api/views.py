from django.shortcuts import render
from rest_framework import generics
from .serializers import QuoteSerializer, IdSerializer, RandomQuoteSerializer
import requests
from django.apps import apps
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import TemplateView
from django.utils.decorators import method_decorator

def is_admin(user):
    return user.is_superuser


@method_decorator(staff_member_required, name='dispatch')
class QuoteCreate(generics.ListCreateAPIView):
    Quotes = apps.get_model('app', 'Quotes')
    queryset = Quotes.objects.all()
    serializer_class = QuoteSerializer


@method_decorator(staff_member_required, name='dispatch')
class GetID(generics.ListAPIView):
    Quotes = apps.get_model('app', 'Quotes')
    serializer_class = IdSerializer
    def get_queryset(self):
        
        server_id = self.request.data['server_id']
        return self.Quotes.objects.filter(server_id = server_id)


@method_decorator(staff_member_required, name='dispatch')
class GetRandomQuote(generics.ListAPIView):
    Quotes = apps.get_model('app', 'Quotes')
    serializer_class = RandomQuoteSerializer

    def get_queryset(self):
        
        server_id = self.request.data['server_id']
        all = self.Quotes.objects.all().filter(server_id = server_id)
        print(all)
        return all