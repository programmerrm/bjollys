from django.contrib.auth.models import BaseUserManager
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, name, email, number, password=None, **extra_fields):
        if not email:
            raise ValidationError(_('Email is required'))
        if not name:
            raise ValidationError(_('Name is required'))
        if not number:
            raise ValidationError(_('Number is required'))

        email = self.normalize_email(email)
        user = self.model(
            name=name,
            email=email,
            number=number,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, email, number, password, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('terms_accepted', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if not password:
            raise ValidationError(_('Superuser must have a password.'))

        return self.create_user(
            name,
            email,
            number,
            password, 
            **extra_fields
        )
    