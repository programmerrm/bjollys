from rest_framework import serializers
from ecommerce.models import CourseDetails

class CourseDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseDetails
        fields = '__all__'
