from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from ecommerce.models import EcommerceServices
from api.ecommerce.serializers.ecommerceServices import EcommerceServiceSerializer

class EcommerceServiceViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        ecommerceServices = EcommerceServices.objects.all()
        try:
            if ecommerceServices:
                serializer = EcommerceServiceSerializer(ecommerceServices, many=True)
                return Response({
                    'success': True,
                    'message': 'E-commerce services data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No e-commerce services found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching e-commerce services data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
