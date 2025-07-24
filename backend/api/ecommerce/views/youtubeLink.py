from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from ecommerce.models import YoutubeLink
from api.ecommerce.serializers.youtubeLink import YoutubeLinkSerializer

class YoutubeLinkViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        youtubeLink = YoutubeLink.objects.all()
        try:
            if youtubeLink:
                serializer = YoutubeLinkSerializer(youtubeLink, many=True)
                return Response({
                    'success': True,
                    'message': 'Youtube link data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No youtube link found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching youtube link data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
