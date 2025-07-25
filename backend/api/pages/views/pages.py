from rest_framework.generics import ListAPIView
from pages.models import PageHeaderContent
from api.pages.serializers.pages import PageHeaderContentSerializer

class PagesView(ListAPIView):
    queryset = PageHeaderContent.objects.all()
    serializer_class = PageHeaderContentSerializer
