from rest_framework import serializers
from ecommerce.models import YoutubeLink

class YoutubeLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = YoutubeLink
        fields = '__all__'
