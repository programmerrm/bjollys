from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.configuration.serializers.contact_info import ContactInfoSerializer
from configuration.models import ContactInfo

class ContactInfoViewSet(viewsets.ViewSet):
    parser_classes = [JSONParser]
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        contactInfo = ContactInfo.objects.all()
        try:
            if contactInfo:
                serializer = ContactInfoSerializer(contactInfo, many=True)
                return Response({
                    'success': True,
                    'message': 'Contact info data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No contact info found in your database',
                'data': [],
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching contact info data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
