from django.urls import path
from api.crouses.views.crouses import EcommerceViewSet
from api.crouses.views.crouses import CryptoViewSet
from api.crouses.views.crouses import EducationViewSet
from api.crouses.views.crouses import StockTradesViewSet
from api.crouses.views.crouses import MarketUpdatesViewSet
from api.crouses.views.crouses import EcommerceSingleCourseView

urlpatterns = [
    path(
        'ecommerce/videos/', 
        EcommerceViewSet.as_view({'get': 'list'}), 
        name='ecommerce-list'
    ),
    path(
        'crypto/videos/',
        CryptoViewSet.as_view({ 'get': 'list' }),
        name='crypto_videos',
    ),
    path(
        'education/videos/',
        EducationViewSet.as_view({ 'get': 'list' }),
        name='education_videos',
    ),
    path(
        'stock/videos/',
        StockTradesViewSet.as_view({ 'get': 'list' }),
        name='stock_videos',
    ),
    path(
        'market/videos/',
        MarketUpdatesViewSet.as_view({ 'get': 'list' }),
        name='market_videos',
    ),
    path(
        'e-commerce-single-course/',
        EcommerceSingleCourseView.as_view({ 'get': 'list' }),
        name='e-commerce_single_course',
    ),
]
