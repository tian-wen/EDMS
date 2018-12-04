"""EDMS URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from user.views import LoginView, TestView
from expert.views import HomePageView
import xadmin

# from haystack.generic_views import SearchView


urlpatterns = [
    path('admin/', admin.site.urls),
    re_path("^$", TemplateView.as_view(template_name="index.html"), name="index"),
    # re_path("^$", HomePageView.as_view(), name="index"),
    re_path("^expert/", include("expert.urls", namespace="expert")),
    re_path("^login/", LoginView.as_view(), name="login"),
    re_path("^test/", TestView.as_view(), name="test"),
    # re_path(r'^search/', include('haystack.urls')),
]
