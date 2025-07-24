from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.configuration.serializers.legal_disclaimer import LegalDisclaimerSerializer
from configuration.models import LegalDisclaimer

class LegalDisclaimerViewSet(viewsets.ViewSet):
    parser_classes = [JSONParser]
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        legalDisclaimer = LegalDisclaimer.objects.first()
        try:
            if legalDisclaimer:
                serializer = LegalDisclaimerSerializer(legalDisclaimer)
                return Response({
                    'success': True,
                    'message': 'Legal disclaimer data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No legal disclaimer found in your database',
                'data': [],
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching legal disclaimer data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
