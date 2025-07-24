from rest_framework import serializers
from privacy_policy.models import PrivacyPolicy

class PrivacyPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicy
        fields = '__all__'
        