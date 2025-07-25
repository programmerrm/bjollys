from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from api.accounts.serializers.register import RegisterSerializer
from configuration.models import WelcomeEmailTemplate

class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = RegisterSerializer(data=request.data)
            
            if serializer.is_valid():
                user = serializer.save()

                email_template = WelcomeEmailTemplate.objects.first()

                subject = email_template.subject
                html_message = render_to_string("emails/registration_welcome.html", {
                    'username': user.name,
                    'email': user.email,
                    'template': email_template,
                })
                plain_message = strip_tags(html_message)

                send_mail(
                    subject,
                    plain_message,
                    settings.EMAIL_HOST_USER,
                    [user.email],
                    html_message=html_message,
                )

                return Response({
                    'success': True,
                    'message': 'Register successfully, a confirmation email has been sent.',
                    'data': serializer.data,
                }, status=status.HTTP_201_CREATED)
            
            return Response({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Server error',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
