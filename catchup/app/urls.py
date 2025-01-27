from django.urls import path
from . import views

urlpatterns  = [
    path("", views.landing, name="landing"),
    path("loggedIn", views.get_authenticated_user, name="loggedIn"),
    path("servers/roster/",views.roster,name="roster"),
    path("discord_login/",views.discord_login,name="discord_login"),
    path('discord_login/redirect/', views.discord_login_redirect, name="discord_login_redirect"),
    path('servers/', views.servers, name="servers")
]