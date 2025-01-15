from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse


auth_url_discord = "https://discord.com/oauth2/authorize?client_id=1302647415802826855&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fdiscord_login%2Fredirect&scope=guilds+identify"

def home(request):
    return render(request, "home.html") 

def landing(request):
    return render(request, "landing.html") 

def  roster(request):
    return render(request, "roster.html")

def discord_login(request):
    return redirect(auth_url_discord)