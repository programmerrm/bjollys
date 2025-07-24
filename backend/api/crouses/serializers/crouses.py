from rest_framework import serializers
from crouses.models import Ecommerce, Crypto, StockTrades, MarketUpdates, Education

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
