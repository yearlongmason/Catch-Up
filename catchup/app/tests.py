from django.test import TestCase
from django.apps import apps
from app.views import delete_quote

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
        self.Quotes.objects.create(quote_id=2, 
                              server_id=1, 
                              quote="To delete",
                              author="John",
                              date_quoted="2025-01-01"
                              )
        return super().setUp()

    def test_get_quote(self):
        quote = self.Quotes.objects.get(quote_id=1)
        self.assertEqual(quote.quote, "I'm so Cool")
    

    # testing to see if a delete quote  can be found
    # if it throws an error that quote was deleted
    # so if error pass otherwise it fails the test
    def test_delete_quote(self):
        delete_quote(2)
        try:
            self.Quotes.objects.get(quote_id=2)
            self.assertEqual(1,2)
        except:
            self.assertEqual(1,1)
        


