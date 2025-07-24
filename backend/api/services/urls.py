from django.urls import path
from api.services.views.services import ServicesViewSet

urlpatterns = [
    path(
        'data/',
        ServicesViewSet.as_view({ 'get': 'list' }),
        name='services',
    ),
]
