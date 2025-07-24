from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.configuration.serializers.copyright import CopyrightSerializer
from configuration.models import Copyright

class CopyrightViewSet(viewsets.ViewSet):
    parser_classes = [JSONParser]
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        copyright = Copyright.objects.first()
        try:
            if copyright:
                serializer = CopyrightSerializer(copyright)
                return Response({
                    'success': True,
                    'message': 'Copyright data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No copyright found in your database',
                'data': [],
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching copyright data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
