from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
import requests
import dotenv
import os
from django.contrib.auth.decorators import login_required
from .forms import ServerForm
from .models import Quotes

dotenv.load_dotenv()

auth_url_discord = "https://discord.com/oauth2/authorize?client_id=1302647415802826855&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fdiscord_login%2Fredirect&scope=guilds+identify"

def home(request):
    return render(request, "home.html") 

@login_required(login_url="discord_login/")
def get_authenticated_user(request):
    return redirect('servers/')

def landing(request):
    return render(request, "landing.html") 

def about(request):
    return render(request, "about.html")

@login_required(login_url="discord_login/")
def servers(request):
    if request.session.get('new_access_token'):
        request.user.access_token = request.session.get('new_access_token')
    
    # asking discord api for users servers
    response = requests.get("https://discord.com/api/v6/users/@me/guilds", headers={
        'Authorization' : 'Bearer %s' % request.user.access_token
    })
    
    servers = response.json()
    # mutual servers is a list of lists of dictionarys so when we grab data from it we use print(server[0]['name'])
    mutual_servers = get_servers(servers)

    # this code will do nothing untill the user submits the from 
    # when the user submits it grabs the data from the form (server id) and redirects to the roster page
    if request.method == 'POST':
        server_form = ServerForm(request.POST)
        if server_form.is_valid():
            server_id = server_form.cleaned_data.get("btn")
            server_name = get_server_name(mutual_servers, server_id)

            #storing in session
            request.session['server_id'] = server_id
            request.session['server_name'] = server_name

            return redirect('roster/')
    else:
        server_form = ServerForm()
    

    return render(request, "servers.html", locals())

# helper function to get server name from server_id from list
def get_server_name(mutual_servers, server_id):
    for server in mutual_servers:
        if server[0]['id'] == server_id:
            # mutual servers is a list of lists of dictionarys so when we grab data from it we use print(server[0]['name'])
            return server[0]['name'] 
    
    #if we don't find the server_id something went very wrong
    return("server id not found in mutual_servers!!!! get_server_name()")

@login_required(login_url="discord_login/")
def roster(request):
    # getting server id from session cookies
    this_server_id = request.session.get('server_id')
    this_server_name = request.session.get('server_name')
    
    mydata = Quotes.objects.filter(server_id=this_server_id).values

    context = {'server_id' : this_server_id,
               'data' : mydata,
               'server_name' : this_server_name,
               'api_key' : os.getenv('API_KEY'),
               'api_url' : os.getenv('DELETE_QUOTE_URL')
               }
    
    return render(request, "roster.html", context)

@login_required(login_url="discord_login/")
def stats(request):
    # getting server id from session cookies
    this_server_id = request.session.get('server_id')
    this_server_name = request.session.get('server_name')
    
    mydata = Quotes.objects.filter(server_id=this_server_id).values

    context = {'server_id' : this_server_id,
               'data' : mydata,
               'server_name' : this_server_name}
    
    return render(request, "stats.html", context)

@login_required(login_url="discord_login/")
def mingames(request):
    return render(request, "minigames.html")

@login_required(login_url="discord_login/")
def guessing_game(request):
    this_server_id = request.session.get('server_id')
    context = {'api_key' : os.getenv('API_KEY'),
               'api_url' : os.getenv('RANDOM_API_URL'),
               'server_id' : this_server_id
            }
    return render(request, "guessinggame.html", context)

def testroster(request):
    return render(request, "testroster.html")

def discord_login(request):
    return redirect(auth_url_discord)

def discord_login_redirect(request):
    code = request.GET.get("code")
    user = exchange_code(code=code)
    discord_user = authenticate(request, user=user)
    
    try:
        discord_user = list(discord_user).pop()
    except TypeError:
        discord_user = discord_user

    login(request, discord_user)
    request.session['new_access_token'] = user["access_token"]
    return redirect('loggedIn')

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
    access_token = credentials["access_token"]
    response = requests.get("https://discord.com/api/v6/users/@me", headers={
        'Authorization' : 'Bearer %s' % access_token
    })
    user = response.json()
    user["access_token"] = access_token
    print(access_token)

    return user

# returns a list of mutual servers that the bot and user are in
# make sure to prefix all info requests for the bot with the keyword "bot"!!!!!!
def get_servers(servers):
    DISCORD_TOKEN = os.getenv('DISCORD_TOKEN')
    response = requests.get("https://discord.com/api/v6/users/@me/guilds", headers={
    'Authorization': f'Bot {DISCORD_TOKEN}'
    })
    response = response.json()
    bot_servers = []
    mutual_servers = []

    for server in response:
        bot_servers.append(server['id'])

    for server in servers:
        if server['id'] in bot_servers:
            mutual_servers.append([server])

    return mutual_servers