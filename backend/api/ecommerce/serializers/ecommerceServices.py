from rest_framework import serializers
from ecommerce.models import EcommerceServices

class EcommerceServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcommerceServices
        fields = '__all__'
