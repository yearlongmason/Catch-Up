from django.shortcuts import render, HttpResponse

def home(request):
    return render(request, "home.html") 

def landing(request):
    return render(request, "landing.html") 