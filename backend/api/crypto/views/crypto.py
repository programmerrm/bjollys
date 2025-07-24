from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from crypto.models import Subscription
from api.crypto.serializers.crypto import CryptoSubscriptionSerializer

class CryptoSubscriptionViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        subscription = Subscription.objects.first()
        try:
            if subscription:
                serializer = CryptoSubscriptionSerializer(subscription)
                return Response({
                    'success': True,
                    'message': 'Subscription data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No subscription found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching subscription data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   