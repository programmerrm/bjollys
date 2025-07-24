from django.contrib.auth import get_user_model
from rest_framework import serializers
from payments.models import Payment

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']

class PaymentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['user', 'payment_date', 'status']
