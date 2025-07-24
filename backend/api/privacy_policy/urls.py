from django.urls import path
from api.privacy_policy.views.privacy_policy import PrivacyPolicyViewSet

urlpatterns = [
    path(
        'data/',
        PrivacyPolicyViewSet.as_view({ 'get': 'list' }),
        name='privacy_policy'
    ),
]
