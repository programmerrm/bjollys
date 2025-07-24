from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.configuration.serializers.footer_logo import FooterLogoSerializer
from configuration.models import FooterLogo

class FooterLogoViewSet(viewsets.ViewSet):
    parser_classes = [JSONParser]
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        footer_logo = FooterLogo.objects.first()
        try:
            if footer_logo:
                serializer = FooterLogoSerializer(footer_logo)
                return Response({
                    'success': True,
                    'message': 'Footer logo data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No Footer logo found in your database',
                'data': [],
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching footer logo data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
