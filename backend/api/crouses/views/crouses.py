import os
import time
import re
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import StreamingHttpResponse, Http404
from django.utils.http import http_date
from django.core.paginator import Paginator
from crouses.models import Ecommerce, Crypto, StockTrades, MarketUpdates, Education, EcommerceSingleCourse
from api.crouses.serializers.crouses import EcommerceSerializer, CryptoSerializer, StockTradesSerializer, MarketUpdatesSerializer, EducationSerializer, EcommerceSingleCourseSerializer
from api.crouses.pagination.pagination import CustomePagination
from rest_framework.pagination import PageNumberPagination

class CryptoViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomePagination

    def list(self, request):
        crypto_courses = Crypto.objects.all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(crypto_courses, request)
        serializer = CryptoSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class StockTradesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomePagination

    def list(self, request):
        stock_trades_courses = StockTrades.objects.all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(stock_trades_courses, request)
        serializer = StockTradesSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
class MarketUpdatesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomePagination

    def list(self, request):
        market_updates_courses = MarketUpdates.objects.all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(market_updates_courses, request)
        serializer = MarketUpdatesSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class EcommerceViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomePagination

    def list(self, request):
        ecommerce_courses = Ecommerce.objects.all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(ecommerce_courses, request)
        serializer = EcommerceSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class EducationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        page_size = 40
        education_courses = Education.objects.all()
        paginator = PageNumberPagination()
        paginator.page_size = page_size
        result_page = paginator.paginate_queryset(education_courses, request)
        serializer = EducationSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class EcommerceSingleCourseView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        course = EcommerceSingleCourse.objects.first()
        serializer = EcommerceSingleCourseSerializer(course)
        return Response({
            'success': True,
            'message': 'E-commerce single course data fetched successfully',
            'data': serializer.data,
        }, status=status.HTTP_200_OK)
