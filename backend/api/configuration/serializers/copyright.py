from rest_framework import serializers
from configuration.models import Copyright

class CopyrightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Copyright
        fields = '__all__'
        