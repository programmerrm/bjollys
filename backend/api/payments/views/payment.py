import stripe
from django.conf import settings
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from payments.models import Payment
from api.payments.serializers.payment import PaymentSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCryptoStripeCheckoutSession(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            amount = request.data.get("amount")
            currency = request.data.get("currency", "usd")
            user = request.user
            
            customer = stripe.Customer.create(
                email=user.email,
                name=user.name,
            )
            customer_id = customer.id

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': currency,
                        'unit_amount': amount,
                        'product_data': {'name': 'Crypto Lifetime Access'},
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f"{settings.FRONTEND_DOMAIN}/payment/success/",
                cancel_url=f"{settings.FRONTEND_DOMAIN}/payment/cancel/",
                customer_email=user.email,
                metadata={
                    "user_id": user.id,
                    "type": "lifetime", 
                    "subscription_type": "crypto",
                    "customer_id": customer_id,
                    "subscription_id": None
                }
            )

            return Response({'url': checkout_session.url})

        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=500)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class CreateEcommerceStripeCheckoutSession(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            amount = request.data.get("amount")
            currency = request.data.get("currency", "usd")
            user = request.user

            customer = stripe.Customer.create(
                email=user.email,
                name=user.name,
            )
            customer_id = customer.id

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': currency,
                        'unit_amount': amount,
                        'product_data': {'name': 'E-commerce Monthly Access'},
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f"{settings.FRONTEND_DOMAIN}/payment/success/",
                cancel_url=f"{settings.FRONTEND_DOMAIN}/payment/cancel/",
                customer_email=user.email,
                metadata={
                    "user_id": user.id,
                    "type": "one-time",
                    "customer_id": customer_id,
                }
            )

            return Response({'url': checkout_session.url})

        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=500)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
class PaymnetViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = []

    def list(self, request):
        payments = Payment.objects.filter(user=request.user).order_by('-id')

        paginator = PageNumberPagination()
        paginator.page_size = 5

        paginated_payments = paginator.paginate_queryset(payments, request)
        serializer = PaymentSerializer(paginated_payments, many=True)
        return paginator.get_paginated_response(serializer.data)
    