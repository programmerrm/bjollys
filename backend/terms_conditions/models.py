from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.translation import gettext_lazy as _

# Create your models here.

class TermsConditions(models.Model):
    body = RichTextUploadingField()

    class Meta:
        verbose_name = _("Terms conditions")
        verbose_name_plural = _("Terms conditions")

    def save(self, *args, **kwargs):
        if not self.pk:
            TermsConditions.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Terms conditions'
    