from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
import requests
import dotenv
import os


dotenv.load_dotenv()


auth_url_discord = "https://discord.com/oauth2/authorize?client_id=1302647415802826855&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fdiscord_login%2Fredirect&scope=guilds+identify"

def home(request):
    return render(request, "home.html") 

def landing(request):
    return render(request, "landing.html") 

def  roster(request):
    return render(request, "roster.html")

def discord_login(request):
    return redirect(auth_url_discord)

def discord_login_redirect(request):
    code = request.GET.get("code")
    user = exchange_code(code=code)
    return JsonResponse({"user" : user})

def exchange_code(code):
    # ask the discord api for some user info using the acces token we got from the user
    data = {
        "client_id" :  os.getenv('APPLICATION_ID'),
        "client_secret" : os.getenv('CLIENT_SECRET'),
        "grant_type" : "authorization_code",
        "code" : code,
        "redirect_uri" : "http://127.0.0.1:8000/discord_login/redirect",
        "scope" : "identify guilds"
    }
    headers = {
        'Content-Type' : 'application/x-www-form-urlencoded'
    }
    response = requests.post("https://discord.com/api/oauth2/token", data=data, headers=headers)
    credentials = response.json()
    print(credentials)
    access_token = credentials["access_token"]
    response = requests.get("https://discord.com/api/v6/users/@me", headers={
        'Authorization' : 'Bearer %s' % access_token
    })
    user = response.json()
    return user