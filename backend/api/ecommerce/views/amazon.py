from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from ecommerce.models import Amazon
from api.ecommerce.serializers.amazon import AmazonSerializer

class AmazonViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        amazon = Amazon.objects.all()
        try:
            if amazon:
                serializer = AmazonSerializer(amazon, many=True)
                return Response({
                    'success': True,
                    'message': 'Amazon data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No amazon found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching amazon data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
