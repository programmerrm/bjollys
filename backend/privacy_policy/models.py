from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.translation import gettext_lazy as _

# Create your models here.

class PrivacyPolicy(models.Model):
    body = RichTextUploadingField()

    class Meta:
        verbose_name = _("Privacy Policy")
        verbose_name_plural = _("Privacy Policy")

    def save(self, *args, **kwargs):
        if not self.pk:
            PrivacyPolicy.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Privacy policy'
    