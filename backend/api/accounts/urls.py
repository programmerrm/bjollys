from django.urls import path
from api.accounts.views.login import LoginView
from api.accounts.views.register import RegisterViewSet
from api.accounts.views.forgot_password import ForgotPasswordViewSet
from api.accounts.views.forgot_password import ResetPasswordViewSet

urlpatterns = [
    path(
        'user/login/',
        LoginView.as_view(),
        name='login',
    ),
    path(
        'user/register/',
        RegisterViewSet.as_view({ 'post': 'create' }),
        name='register',
    ),
    path(
        'user/forgot-password/',
        ForgotPasswordViewSet.as_view({'post': 'post'}),
        name='forgot_password',
    ),
    path(
        'user/reset-password/<uidb64>/<token>/',
        ResetPasswordViewSet.as_view({'post': 'post'}),
        name='reset_password',
    ),
]
