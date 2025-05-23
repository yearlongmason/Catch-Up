from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
import requests
import dotenv
import os
from django.contrib.auth.decorators import login_required
from .forms import ServerForm, QuoteDeleteForm
from .models import Quotes
from time import sleep
from random import randrange, shuffle

dotenv.load_dotenv()

auth_url_discord = os.getenv('DISCORD_AUTH_LINK')
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

    if this_server_id == None:
        return render(request, "404.html")

    if request.method == 'POST':
        del_form = QuoteDeleteForm(request.POST)
        if del_form.is_valid():
            quote_id = del_form.cleaned_data.get("delbtn")
            if quote_id != -1:
                delete_quote(quoteid=quote_id)
        else:
            del_form = QuoteDeleteForm()

    context = {'server_id' : this_server_id,
               'data' : mydata,
               'server_name' : this_server_name
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
    quote = getRandomQuote(request)
    context = {'quote' : quote["quote"],
               'author' : quote["author"],
            }

    return render(request, "guessinggame.html", context)


@login_required(login_url="discord_login/")
def word_scramble(request):
    quote = getRandomQuote(request)
    context = {'orginal' : quote["quote"].replace("'", ""),
               'scrambled' : scramble_sentence_or_word(quote["quote"]),
               'author' : quote["author"],
            }
    
    return render(request, "wordScramble.html", context)

def custom_404(request, exception):
    return render(request, '404.html', status=404)

def custom_500(request, exception):
    return render(request, '500.html', status=500)

def discord_login(request):
    return redirect(auth_url_discord)

def discord_login_redirect(request):
    code = request.GET.get("code")
    # Check if token is already cached in session to avoid re-exchange
    if request.session.get('new_access_token'):
        return redirect('loggedIn')
    
    user = exchange_code(code=code)
    discord_user = authenticate(request, user=user)
    login(request, discord_user)
    # Store the token in session after successful exchange
    request.session['new_access_token'] = user["access_token"]
    return redirect('loggedIn')

def exchange_code(code):
    # ask the discord api for some user info using the acces token we got from the user
    data = {
        "client_id" :  os.getenv('APPLICATION_ID'),
        "client_secret" : os.getenv('CLIENT_SECRET'),
        "grant_type" : "authorization_code",
        "code" : code,
        "redirect_uri" : os.getenv('DISCORD_LOGIN_REDIRECT'),
        "scope" : "identify guilds"
    }
    headers = {
        'Content-Type' : 'application/x-www-form-urlencoded'
    }
    response = requests.post("https://discord.com/api/v8/oauth2/token", data=data, headers=headers)
    
    if response.status_code == 429:
        # we are getting rate limited!!!
        print(response.headers)
        print(response)


    credentials = response.json()
    access_token = credentials["access_token"]
    response = requests.get("https://discord.com/api/v8/users/@me", headers={
        'Authorization' : 'Bearer %s' % access_token
    })
    user = response.json()
    print(user)
    user["access_token"] = access_token

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


# helper  function for minigames
def getRandomQuote(request):
    this_server_id = request.session.get('server_id')
    data = Quotes.objects.all().filter(server_id = this_server_id)

    if not data:
        return "Could not find a quote."

    serialized_data = [{
        "quote" : q.quote,
        "author" : q.author
    } for q in data]

    randIndex = randrange(0, len(serialized_data))
    randomQuote = serialized_data[randIndex]

    return randomQuote

# helper  function for minigames
def scramble_sentence_or_word(text):
    words = text.split()

    if len(words) == 1:
        # Single word case: scramble its letters
        word = list(words[0])
        shuffle(word)
        scrambled = "".join(word)
    else:
        # Multiple words case: shuffle the words
        shuffle(words)
        scrambled = " ".join(words)

    return scrambled

# to delete a quote..... ya!!!!
def delete_quote(quoteid) -> bool:
    try:
        Quotes.objects.all().filter(quote_id=quoteid).delete()
    except:
        return False

    print("worked!!!")
    return True