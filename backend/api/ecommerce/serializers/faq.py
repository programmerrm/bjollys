from rest_framework import serializers
from ecommerce.models import FAQ

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'
