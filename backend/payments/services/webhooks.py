import stripe
import logging
from datetime import timezone, timedelta
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from payments.models import Payment, Subscription
from accounts.models import User
from django.conf import settings

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    if request.method != 'POST':
        return HttpResponse(status=405)

    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    if not sig_header:
        return HttpResponse("Signature missing", status=400)

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        return HttpResponse("Invalid payload", status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse("Invalid signature", status=400)
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        metadata = session.get('metadata', {})
        user_id = metadata.get('user_id')
        payment_type = metadata.get('type')
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')

        if not user_id:
            return JsonResponse({'error': 'User ID missing'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        Payment.objects.create(
            user=user,
            amount=session.get('amount_total', 0) / 100,
            currency=session.get('currency', 'USD').upper(),
            status='completed',
            stripe_payment_intent=session.get('payment_intent'),
        )

        subscription, _ = Subscription.objects.get_or_create(user=user)

        if payment_type == 'lifetime':
            subscription.subscription_type = 'crypto'
            subscription.status = 'active'
            subscription.is_recurring = False
            subscription.next_billing_date = None
            subscription.renew_type = 'lifetime'
        elif payment_type == 'recurring':
            subscription.subscription_type = 'e-commerce'
            subscription.status = 'active'
            subscription.is_recurring = True
            subscription.next_billing_date = timezone.now() + timedelta(days=30)
            subscription.renew_type = 'monthly'
        else:
            subscription.subscription_type = 'crypto'
            subscription.status = 'active'
            subscription.is_recurring = False
            subscription.next_billing_date = None
            subscription.renew_type = 'lifetime'

        subscription.stripe_subscription_id = subscription_id
        subscription.stripe_customer_id = customer_id
        subscription.save()

    return HttpResponse(status=200)
