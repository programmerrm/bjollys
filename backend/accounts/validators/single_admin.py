from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

User = get_user_model()

def VALIDATE_SINGLE_ADMIN(user):
    if user.role == 'admin':
        existing_admins = User.objects.filter(role='admin')
        if user.pk:
            existing_admins = existing_admins.exclude(pk=user.pk)
        if existing_admins.exists():
            raise ValidationError(_('Only one admin is allowed.'))
