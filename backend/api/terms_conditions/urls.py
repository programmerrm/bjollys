from django.urls import path
from api.terms_conditions.views.terms_conditions import TermsConditionViewSet

urlpatterns = [
    path(
        'data/',
        TermsConditionViewSet.as_view({ 'get': 'list' }),
        name='terms_condition',
    ),
]
