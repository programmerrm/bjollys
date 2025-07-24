from django.urls import path
from api.ecommerce.views.image import ImageViewSet
from api.ecommerce.views.video import VideoViewSet
from api.ecommerce.views.amazon import AmazonViewSet
from api.ecommerce.views.courseDetails import CourseDetailsViewSet
from api.ecommerce.views.youtubeLink import YoutubeLinkViewSet
from api.ecommerce.views.faq import FAQViewSet
from api.ecommerce.views.ecommerceServices import EcommerceServiceViewSet
from api.ecommerce.views.whatsAppNumber import WhatsAppNumberViewSet
from api.ecommerce.views.booking import BookingViewSet

urlpatterns = [
    path(
        'image/',
        ImageViewSet.as_view({ 'get': 'list' }),
        name='image',
    ),
    path(
        'video/',
        VideoViewSet.as_view({ 'get': 'list' }),
        name='video',
    ),
    path(
        'amazon/',
        AmazonViewSet.as_view({ 'get': 'list' }),
        name='amazon',
    ),
    path(
        'course-details/',
        CourseDetailsViewSet.as_view({ 'get': 'list' }),
        name='course-details',
    ),
    path(
        'youtube-link/',
        YoutubeLinkViewSet.as_view({ 'get': 'list' }),
        name='youtube-link',
    ),
    path(
        'faq/',
        FAQViewSet.as_view({ 'get': 'list' }),
        name='faq',
    ),
    path(
        'services/',
        EcommerceServiceViewSet.as_view({ 'get': 'list' }),
        name='ecommerce-service',
    ),
    path(
        'whatsapp-number/',
        WhatsAppNumberViewSet.as_view({ 'get': 'list' }),
        name='whatsapp_number',
    ),
    path(
        'booking/',
        BookingViewSet.as_view({ 'post': 'create' }),
        name='booking',
    ),
]
