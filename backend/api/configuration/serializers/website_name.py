from rest_framework import serializers
from configuration.models import WebsiteName

class WebsiteNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteName
        fields = '__all__'
        