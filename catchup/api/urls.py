from django.urls import path
from . import views



urlpatterns  = [
    path("quote_create/", views.QuoteCreate.as_view(), name="Quotes-view-create"),
    path("get_quoteid/", views.GetID.as_view(), name="Quotes-view-id"),
    path("get_random_quote/", views.GetRandomQuote.as_view(), name="Quotes-view-random"),
    path("delete_quote/", views.QuoteDelete.as_view(), name="DeleteQuote")
]