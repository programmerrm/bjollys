from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    # local_ip = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        # local_ip = attrs.get('local_ip')

        if not email:
            raise serializers.ValidationError({
                'email': _('Email is required')
            })

        if not password:
            raise serializers.ValidationError({
                'password': _('Password is required')
            })

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if user is None:
            if not User.objects.filter(email=email).exists():
                raise serializers.ValidationError({
                    'email': _('No user found with this email')
                })
            else:
                raise serializers.ValidationError({
                    'password': _('Incorrect password')
                })
        
        # if user.local_ip != local_ip:
        #     raise serializers.ValidationError({'local_ip': _('Local IP does not match')})

        if not user.is_active:
            raise serializers.ValidationError({
                'email': _('User account is disabled.')
            })
        
        if user.is_superuser:
            raise serializers.ValidationError({
                'email': _('Admin account login is not allowed.')
            })
        
        attrs['user'] = user
        return attrs
