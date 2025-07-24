from django.urls import path
from api.crypto.views.crypto import CryptoSubscriptionViewSet

urlpatterns = [
    path(
        'subscription/',
        CryptoSubscriptionViewSet.as_view({ 'get': 'list' }),
        name='crypto_subscription',
    ),
]
