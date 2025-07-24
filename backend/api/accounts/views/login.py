from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import AllowAny
from accounts.services.jwt_token import GENERATE_JWT_TOKEN
from api.accounts.serializers.login import LoginSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]
    renderer_classes = [JSONRenderer]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        try:
            if serializer.is_valid():
                user = serializer.validated_data['user']
                token = GENERATE_JWT_TOKEN(user)
                user_data = {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'image': user.image.url if user.image and hasattr(user.image, 'url') else None,
                }
                return Response({
                    'success': True,
                    'message': 'Login successfully.',
                    'data': {
                        'user': user_data,
                        'tokens': token,
                    },
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': '',
                'errors': f'An error occurred: {str(e)}.',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    