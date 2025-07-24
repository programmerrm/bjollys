from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

class SubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        subscriptions = user.subscriptions.all()

        if not subscriptions.exists():
            return Response({
                'success': False,
                "message": "No active subscriptions found."
            }, status=404)

        subscription_data = []
        for subscription in subscriptions:
            subscription_data.append({
                "status": subscription.status,
                "next_billing_date": subscription.next_billing_date.isoformat() if subscription.next_billing_date else None,
                "is_recurring": subscription.is_recurring,
                "stripe_subscription_id": subscription.stripe_subscription_id,
                "stripe_customer_id": subscription.stripe_customer_id,
                "subscription_type": subscription.subscription_type,
            })

        return Response({
            'success': True,
            'data': subscription_data
        }, status=200)
