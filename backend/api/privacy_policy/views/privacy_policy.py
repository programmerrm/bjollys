from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.privacy_policy.serializers.privacy_policy import PrivacyPolicySerializer
from privacy_policy.models import PrivacyPolicy

class PrivacyPolicyViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        privacyPolicy = PrivacyPolicy.objects.first()
        try:
            if privacyPolicy:
                serializer = PrivacyPolicySerializer(privacyPolicy)
                return Response({
                    'success': True,
                    'message': 'Privacy policy data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No privacy policy found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching privacy policy data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        