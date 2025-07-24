from rest_framework import serializers
from django.contrib.auth import get_user_model
from accounts.validators.register import VALIDATE_TERMS_ACCEPTED
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    terms_accepted = serializers.BooleanField(required=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'number', 'password', 'confirm_password', 'gender', 'date_of_birth', 'country', 'signature', 'role', 'local_ip', 'terms_accepted']

    def validate_terms_accepted(self, value):
        return VALIDATE_TERMS_ACCEPTED(value)

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({
                'confirm_password': 'Confirm password do not match.'
            })
        return attrs
    
    def validate_role(self, value):
        allowed_roles = ['admin', 'crypto', 'e-commerce']
        if value not in allowed_roles:
            raise serializers.ValidationError(
                f"Invalid role provided. Must be one of {', '.join(allowed_roles)}."
            )
        return value

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')

        try:
            user = User(**validated_data)
            user.set_password(password)
            user.save()
            return user
        except DjangoValidationError as e:
            raise serializers.ValidationError(
                e.message_dict if hasattr(e, 'message_dict') else {'detail': list(e.message)}
            )
    