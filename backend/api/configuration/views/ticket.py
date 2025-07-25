from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from configuration.models import Ticket
from api.configuration.serializers.ticket import TicketSerializer

class CreateTickerViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request):
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({
                "success": True,
                "message": "Ticket submitted successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)
    
class TickerViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        payments = Ticket.objects.filter(user=request.user).order_by('-id')

        paginator = PageNumberPagination()
        paginator.page_size = 5

        paginated_payments = paginator.paginate_queryset(payments, request)
        serializer = TicketSerializer(paginated_payments, many=True)
        return paginator.get_paginated_response(serializer.data)
    