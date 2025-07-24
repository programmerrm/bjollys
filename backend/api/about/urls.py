from django.urls import path
from api.about.views.about import AboutViewSet

urlpatterns = [
    path(
        'data/',
        AboutViewSet.as_view({ 'get': 'list' }),
        name='about',
    ),
]
