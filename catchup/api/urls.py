from django.urls import path
from . import views



urlpatterns  = [
    path("quote_create/", views.QuoteCreate.as_view(), name="Quotes-view-create"),
    path("get_quoteid/", views.GetID.as_view(), name="Quotes-view-id")
]