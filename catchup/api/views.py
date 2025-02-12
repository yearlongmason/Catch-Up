from django.shortcuts import render
from rest_framework import generics
from .models import Quotes
from .serializers import QuoteSerializer


class QuoteCreate(generics.ListCreateAPIView):
    queryset = Quotes.objects.all
    seriazlizer_class = QuoteSerializer