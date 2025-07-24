from rest_framework import serializers
from ecommerce.models import WhatsAppNumber

class WhatsAppNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatsAppNumber
        fields = '__all__'
