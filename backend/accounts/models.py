from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import MinLengthValidator
from django.utils.translation import gettext_lazy as _
from accounts.managers import UserManager
from accounts.utils.image_upload import USER_DIRECTORY_PATH
from accounts.utils.gender import GENDERS
from accounts.utils.role import ROLES
from core.utils import VALIDATE_EMAIL, VALIDATE_PHONE_NUMBER, VALIDATE_IMAGE_SIZE, VALIDATE_IMAGE_EXTENSION

# Create your models here.

class User(AbstractBaseUser, PermissionsMixin):
    image = models.ImageField(
        upload_to=USER_DIRECTORY_PATH,
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        verbose_name=_('Image'),
        help_text=_('Upload your image...'),
        null=True,
        blank=True,
    )
    user_id = models.CharField(
        unique=True,
        db_index=True,
        max_length=9,
        validators=[MinLengthValidator(9)],
        editable=False,
        verbose_name=_('User ID'),
    )
    name = models.CharField(
        max_length=60,
        validators=[MinLengthValidator(3)],
        verbose_name=_('Name'),
        help_text=_('Enter your name...'),
    )
    email = models.EmailField(
        unique=True,
        db_index=True,
        max_length=80,
        validators=[VALIDATE_EMAIL, MinLengthValidator(10)],
        verbose_name=_('Email'),
        help_text=_('Enter your email...'),
    )
    number = models.CharField(
        db_index=True,
        max_length=20,
        null=True,
        blank=True,
        validators=[VALIDATE_PHONE_NUMBER, MinLengthValidator(5)],
        verbose_name=_('Number'),
        help_text=_('Enter your number...'),
    )
    gender = models.CharField(
        max_length=20,
        choices=GENDERS,
        null=True,
        blank=True,
        verbose_name=_('Gender'),
        help_text=_('Enter your gender...'),
    )
    date_of_birth = models.DateField(
        null=True,
        blank=True,
        verbose_name=_('Birth Date'),
        help_text=_('Enter your birth date...'),
    )
    country = models.CharField(
        max_length=25,
        validators=[MinLengthValidator(3)],
        null=True,
        blank=True,
        verbose_name=_('Country'),
        help_text=_('Enter your country')
    )
    signature = models.CharField(
        max_length=40,
        validators=[MinLengthValidator(3)],
        null=True,
        blank=True,
        verbose_name=_('Signature'),
        help_text=_('Enter your signature...'),
    )
    role = models.CharField(
        max_length=20,
        choices=ROLES,
        null=True,
        blank=True,
        verbose_name=_('Role'),
        help_text=_('Enter your role...'),
    )
    local_ip = models.GenericIPAddressField(unique=True, null=True, blank=True)
    terms_accepted = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_block = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_superuser = models.BooleanField(default=False, verbose_name=_('Is Admin'),)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='accounts_user_set',
        blank=True,
        help_text=_('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        verbose_name=_('groups'),
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='accounts_user_set',
        blank=True,
        help_text=_('Specific permissions for this user.'),
        verbose_name=_('user permissions'),
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['number', 'name']

    objects = UserManager()

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return self.name or self.email
    
    def clean(self):
        from accounts.validators.single_admin import VALIDATE_SINGLE_ADMIN
        VALIDATE_SINGLE_ADMIN(self)
