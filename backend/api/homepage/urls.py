from django.urls import path
from api.homepage.views.homepage import WhyChooseUsViewSet, TeamViewSet, BannerViewSet

urlpatterns = [
    path(
        'why-choose-us/',
        WhyChooseUsViewSet.as_view({ 'get': 'list' }),
        name='why_choose_us',
    ),
    path(
        'teams/',
        TeamViewSet.as_view({ 'get': 'list' }),
        name='teams',
    ),
    path(
        'banner/',
        BannerViewSet.as_view({ 'get': 'list' }),
        name='banner',
    ),
]
