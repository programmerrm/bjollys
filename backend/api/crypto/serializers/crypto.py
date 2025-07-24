from rest_framework import serializers
from crypto.models import Subscription

class CryptoSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'
