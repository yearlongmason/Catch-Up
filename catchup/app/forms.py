from django import forms

class ServerForm(forms.Form):
    btn = forms.CharField()

class QuoteForm(forms.Form):
    subbtn = forms.CharField()