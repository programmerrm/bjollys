from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.translation import gettext_lazy as _
from django.utils.html import strip_tags

# Create your models here.

class Services(models.Model):
    image = models.ImageField(
        upload_to='services/',
        null=True,
        blank=True,
        verbose_name=_('Service Image'),
        help_text=_('Upload an image representing the service (e.g. icon or illustration).'),
    )
    title = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_('Service Title'),
        help_text=_('Enter the name or title of the service.'),
    )
    description = RichTextUploadingField(
        null=True,
        blank=True,
        verbose_name=_('Service Description'),
        help_text=_('Provide a brief description of the service offered.'),
    )

    class Meta:
        verbose_name = _('Service')
        verbose_name_plural = _('Services')
        ordering = ['-id']

    def __str__(self):
        return f"Service: {strip_tags(self.title)[:50] or 'Untitled'}"
