from rest_framework import serializers
from ecommerce.models import Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'
