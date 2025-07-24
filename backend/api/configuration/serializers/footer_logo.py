from rest_framework import serializers
from configuration.models import FooterLogo

class FooterLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterLogo
        fields = '__all__'
        