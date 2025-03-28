from django.urls import path
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns  = [
    path("", views.landing, name="landing"),
    path("loggedIn", views.get_authenticated_user, name="loggedIn"),
    path("servers/roster/",views.roster,name="roster"),
    path("servers/testroster/",views.testroster,name="testroster"),
    path("discord_login/",views.discord_login,name="discord_login"),
    path('discord_login/redirect/', views.discord_login_redirect, name="discord_login_redirect"),
    path('servers/', views.servers, name="servers"),
    path('about/', views.about, name="about"),
    path('servers/roster/stats/', views.stats, name="stats"),
    path('servers/roster/minigames/', views.mingames, name="mingames"),
    path('servers/roster/minigames/guessinggame/', views.guessing_game, name="Guess Author"),
    path('servers/roster/minigames/wordScramble/', views.word_scramble, name="Word Scramble")
]

urlpatterns += staticfiles_urlpatterns()
