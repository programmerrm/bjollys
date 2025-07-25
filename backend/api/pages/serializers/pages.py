from rest_framework import serializers
from configuration.models import HeaderMenu
from pages.models import PageHeaderContent

class HeaderMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeaderMenu
        fields = '__all__'

class PageHeaderContentSerializer(serializers.ModelSerializer):
    menu = HeaderMenuSerializer(read_only=True)
    class Meta:
        model = PageHeaderContent
        fields = '__all__'
