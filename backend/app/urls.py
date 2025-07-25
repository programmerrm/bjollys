"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

BASE_API = 'api/v1'

urlpatterns = [
    path('', lambda request: JsonResponse({"message": "Welcome to the Bijolis API 🚀"})),
    path('admin/', admin.site.urls),

    path(f'{BASE_API}/about/', include('api.about.urls')),
    path(f'{BASE_API}/channels/', include('api.channels.urls')),
    path(f'{BASE_API}/homepage/', include('api.homepage.urls')),
    path(f'{BASE_API}/services/', include('api.services.urls')),
    path(f'{BASE_API}/crypto/', include('api.crypto.urls')),
    path(f'{BASE_API}/e-commerce/', include('api.ecommerce.urls')),
    path(f'{BASE_API}/crouses/', include('api.crouses.urls')),
    path(f'{BASE_API}/privacy-policy/', include('api.privacy_policy.urls')),
    path(f'{BASE_API}/terms-condition/', include('api.terms_conditions.urls')),
    path(f'{BASE_API}/pages/', include('api.pages.urls')),

    path('ckeditor/', include('ckeditor_uploader.urls')),
    path(f'{BASE_API}/accounts/', include('api.accounts.urls')),
    path(f'{BASE_API}/configuration/', include('api.configuration.urls')),
    path(f'{BASE_API}/payments/', include('api.payments.urls')),
    path(f'{BASE_API}/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path(f'{BASE_API}/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path(f'{BASE_API}/schema/', SpectacularAPIView.as_view(), name='schema'),
    path(f'{BASE_API}/schema/swagger-ui/', SpectacularSwaggerView.as_view(), name='swagger_ui'),
    path(f'{BASE_API}/schema/redoc/', SpectacularRedocView.as_view(), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += staticfiles_urlpatterns()
