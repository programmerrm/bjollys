from rest_framework import serializers
from channels.models import Channels

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channels
        fields = '__all__'
        