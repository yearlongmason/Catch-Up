from django import forms

class ServerForm(forms.Form):
    btn = forms.CharField()

class QuoteDeleteForm(forms.Form):
    delbtn = forms.CharField()