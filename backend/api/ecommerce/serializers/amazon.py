from rest_framework import serializers
from ecommerce.models import Amazon

class AmazonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amazon
        fields = '__all__'
