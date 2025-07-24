from django.urls import path
from api.channels.views.channels import ChannelsViewSet

urlpatterns = [
    path(
        'data/',
        ChannelsViewSet.as_view({ 'get': 'list' }),
        name='channels',
    ),
]
