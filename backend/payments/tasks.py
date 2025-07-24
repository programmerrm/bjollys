from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from payments.models import Subscription

@shared_task
def check_and_expire_subscriptions():
    subscriptions = Subscription.objects.filter(
        subscription_type='e-commerce', 
        status='active'
    )
    for subscription in subscriptions:
        if subscription.is_expired():
            send_expiry_email(subscription)

def send_expiry_email(subscription):
    subject = "Your Subscription has Expired"
    message = f"Dear {subscription.user.name},\n\nYour {subscription.subscription_type} subscription has expired."
    recipient_email = subscription.user.email
    send_mail(
        subject, 
        message, 
        settings.DEFAULT_FROM_EMAIL, 
        [recipient_email]
    )
