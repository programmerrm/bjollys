from rest_framework import serializers
from configuration.models import LegalDisclaimer

class LegalDisclaimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalDisclaimer
        fields = '__all__'
        