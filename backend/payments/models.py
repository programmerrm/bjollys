from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

SUBSCRIPTION_TYPE_CHOICES = [
    ('crypto', 'Crypto'),
    ('e-commerce', 'E-Commerce'),
]

RENEW = [
    ('lifetime', 'Lifetime'),
    ('monthly', 'Monthly'),
]

STATUS_CHOICES = [
    ('active', 'Active'),
    ('inactive', 'Inactive'),
    ('cancelled', 'Cancelled'),
    ('expired', 'Expired'),
]

class Subscription(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='subscriptions',
    )
    start_date = models.DateTimeField(
        auto_now_add=True,
    )
    next_billing_date = models.DateTimeField(
        blank=True, 
        null=True,
    )
    is_recurring = models.BooleanField(
        default=False,
    )
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='inactive',
    )
    subscription_type = models.CharField(
        max_length=20, 
        choices=SUBSCRIPTION_TYPE_CHOICES, 
        default='crypto',
    )
    renew_type = models.CharField(
        max_length=20, 
        choices=RENEW, 
        default='monthly',
    )
    stripe_subscription_id = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
    )
    stripe_customer_id = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
    )

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.user.name} - {self.status}"

    def activate(self, stripe_subscription_id=None, stripe_customer_id=None):
        self.status = 'active'
        if self.subscription_type == 'crypto':
            self.renew_type = 'lifetime'
            self.is_recurring = False
            self.next_billing_date = None
        else:
            self.next_billing_date = timezone.now() + timedelta(days=30)
            self.renew_type = 'monthly'
            self.is_recurring = True
        if stripe_subscription_id:
            self.stripe_subscription_id = stripe_subscription_id
        if stripe_customer_id:
            self.stripe_customer_id = stripe_customer_id
        self.save()
        self.send_activation_email()

    def is_expired(self):
        if self.subscription_type == 'e-commerce' and self.next_billing_date and timezone.now() > self.next_billing_date:
            self.status = 'expired'
            self.save()
            self.send_expiry_email()
            return True
        return False

    def renew(self):
        if self.subscription_type == 'e-commerce' and self.renew_type == 'monthly':
            self.next_billing_date += timedelta(days=30)
            self.save()
        elif self.subscription_type == 'crypto' and self.renew_type == 'lifetime':
            pass
        self.save()

    def send_activation_email(self):
        subject = "Your Subscription is Activated!"
        message = f"Dear {self.user.name},\n\nYour {self.subscription_type} subscription has been successfully activated."
        recipient_email = self.user.email
        send_mail(
            subject, 
            message, 
            settings.DEFAULT_FROM_EMAIL, 
            [recipient_email],
        )

    def send_expiry_email(self):
        subject = "Your Subscription has Expired"
        message = f"Dear {self.user.name},\n\nWe regret to inform you that your {self.subscription_type} subscription has expired. Please renew to continue enjoying our services."
        recipient_email = self.user.email
        send_mail(
            subject, 
            message, 
            settings.DEFAULT_FROM_EMAIL, 
            [recipient_email],
        )

class Payment(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='payments',
    )
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=15.00,
    )
    currency = models.CharField(
        max_length=3, 
        default='USD',
    )
    payment_date = models.DateTimeField(
        auto_now_add=True,
    )
    status = models.CharField(
        max_length=20, 
        choices=[
            ('pending', 'Pending'), 
            ('completed', 'Completed'), 
            ('failed', 'Failed'),
        ],
    )
    stripe_payment_intent = models.CharField(
        max_length=255, 
        blank=True, 
        null=True
    )

    def __str__(self):
        return f"{self.user.name} - {self.amount} {self.currency} - {self.status}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.status == 'completed':
            subscription = Subscription.objects.filter(user=self.user).first()
            if not subscription:
                self.create_subscription()
            else:
                self.renew_subscription(subscription)

    def create_subscription(self):
        subscription = Subscription.objects.create(
            user=self.user, 
            subscription_type='e-commerce', 
            status='active'
        )
        subscription.activate()

    def renew_subscription(self, subscription):
        if subscription.status in ['inactive', 'expired']:
            subscription.renew()
            subscription.status = 'active'
            subscription.save()
        elif subscription.status == 'active':
            pass
