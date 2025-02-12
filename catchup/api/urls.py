from django.urls import path
from . import views



urlpatterns  = [
    path("quote/", views.QuoteCreate.as_view(), name="Quotes-view-create")
]