from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.terms_conditions.serializers.terms_conditions import TermsConditionSerializer
from terms_conditions.models import TermsConditions

class TermsConditionViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        termsCondition = TermsConditions.objects.first()
        try:
            if termsCondition:
                serializer = TermsConditionSerializer(termsCondition)
                return Response({
                    'success': True,
                    'message': 'Terms & condition data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No terms & condition found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching terms & condition data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        