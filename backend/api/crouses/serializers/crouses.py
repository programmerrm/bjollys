from rest_framework import serializers
from crouses.models import Ecommerce, Crypto, StockTrades, MarketUpdates, Education, EcommerceSingleCourse, SingleCourseBundle

class SingleCourseBundleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SingleCourseBundle
        fields = '__all__'

class EcommerceSingleCourseSerializer(serializers.ModelSerializer):
    single_course_bundles = SingleCourseBundleSerializer(many=True, read_only=True)
    class Meta:
        model = EcommerceSingleCourse
        fields = '__all__'

class EcommerceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ecommerce
        fields = '__all__'

class CryptoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crypto
        fields = '__all__'

class StockTradesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTrades
        fields = '__all__'

class MarketUpdatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketUpdates
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'
