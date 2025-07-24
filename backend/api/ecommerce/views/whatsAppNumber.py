from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from ecommerce.models import WhatsAppNumber
from api.ecommerce.serializers.whatsAppNumber import WhatsAppNumberSerializer

class WhatsAppNumberViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        whatsAppNumber = WhatsAppNumber.objects.first()
        try:
            if whatsAppNumber:
                serializer = WhatsAppNumberSerializer(whatsAppNumber)
                return Response({
                    'success': True,
                    'message': 'Whatsapp number data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No whatsapp number found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching whatsapp number data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
