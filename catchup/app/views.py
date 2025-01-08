from django.shortcuts import render, HttpResponse

def home(request):
    return render(request, "home.html") 

def landing(request):
    return render(request, "landing.html") 

def  roster(request):
    return render(request, "roster.html")