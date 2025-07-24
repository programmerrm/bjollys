from rest_framework import serializers
from terms_conditions.models import TermsConditions

class TermsConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermsConditions
        fields = '__all__'
        