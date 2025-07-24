from django.urls import path
from api.payments.views.subscription import SubscriptionView
from api.payments.views.payment import CreateCryptoStripeCheckoutSession, CreateEcommerceStripeCheckoutSession, PaymnetViewSet
from payments.services.webhooks import stripe_webhook

urlpatterns = [
    path(
        'create-crypto-checkout-session/', 
        CreateCryptoStripeCheckoutSession.as_view(), 
        name='create-checkout',
    ),
    path(
        'create-e-commerce-checkout-session/', 
        CreateEcommerceStripeCheckoutSession.as_view(), 
        name='create-checkout',
    ),
    path(
        'stripe/webhook/', 
        stripe_webhook, 
        name='stripe-webhook',
    ),
    path(
        'subscription/',
        SubscriptionView.as_view(),
        name='subscription',
    ),
    path(
        'all/',
        PaymnetViewSet.as_view({ 'get': 'list' }),
        name='payment',
    ),
]
