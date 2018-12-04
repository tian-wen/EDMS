from django.views.generic import TemplateView
from django.urls import path, re_path, include
import xadmin

from .views import ExpertListView, ExpertDetailView

app_name = "expert"

urlpatterns = [
    # re_path("^home_page",  HomePageView.as_view(), name="home_page")
    re_path("^detail",  ExpertDetailView.as_view(), name="detail"),
    re_path("^list",  ExpertListView.as_view(), name="list"),
]