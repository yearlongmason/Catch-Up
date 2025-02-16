from django.shortcuts import render
from rest_framework import generics
from .models import Quotes
from .serializers import QuoteSerializer, IdSerializer


class QuoteCreate(generics.ListCreateAPIView):
    queryset = Quotes.objects.all()
    serializer_class = QuoteSerializer

class GetID(generics.ListAPIView):
    queryset = Quotes.objects.values().order_by("-quote_id")
    serializer_class = IdSerializer