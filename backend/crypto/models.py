from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Subscription(models.Model):
    price = models.CharField(verbose_name=_('Price'), max_length=500,)
    body = RichTextUploadingField(verbose_name=_("Subscription Content"))
    
    class Meta:
        verbose_name = _("Subscription")
        verbose_name_plural = _("Subscriptions")
        ordering = ["id"]

    def save(self, *args, **kwargs):
        if not self.pk:
            Subscription.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.body[:50] if self.body else "Subscription"
    