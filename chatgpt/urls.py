# blog/urls.py
from django.urls import path
from . import views

app_name = 'chatgpt'
urlpatterns = [
    path('', views.index, name='index'),
    path('send', views.send, name='send'),
]
