from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.configuration.serializers.website_name import WebsiteNameSerializer
from configuration.models import WebsiteName

class WebsiteNameViewSet(viewsets.ViewSet):
    parser_classes = [JSONParser]
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        website_name = WebsiteName.objects.first()
        try:
            if website_name:
                serializer = WebsiteNameSerializer(website_name)
                return Response({
                    'success': True,
                    'message': 'Website name data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No website name found in your database',
                'data': [],
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching website name data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
