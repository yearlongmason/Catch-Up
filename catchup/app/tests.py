from django.test import TestCase
from django.apps import apps

# Create your tests here.
class TestGetQuote(TestCase):
    def setUp(self):
        self.Quotes = apps.get_model('app', 'Quotes')
        self.Quotes.objects.create(quote_id=1, 
                              server_id=1, 
                              quote="I'm so Cool",
                              author="John",
                              date_quoted="2003-01-25"
                              )
        return super().setUp()

    def test_get_quote(self):
        quote = self.Quotes.objects.get(quote_id=1)
        self.assertEqual(quote.quote, "I'm so Cool")

    