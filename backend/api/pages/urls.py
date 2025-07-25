from django.urls import path
from api.pages.views.pages import PagesView

urlpatterns = [
    path('all/', PagesView.as_view(), name='pages-list'),
]
