from django.db import models
from django.utils.html import strip_tags
from ckeditor_uploader.fields import RichTextUploadingField
from configuration.models import HeaderMenu

# Create your models here.

class PageHeaderContent(models.Model):
    menu = models.ForeignKey(
        HeaderMenu,
        on_delete=models.CASCADE,
        related_name='contents',
        verbose_name="Header Menu",
        help_text="Select the header menu this content belongs to."
    )
    title = models.CharField(
        max_length=500,
        verbose_name="Title",
        help_text="Enter the section title.",
        null=True,
        blank=True
    )
    description = RichTextUploadingField(
        verbose_name="Description",
        help_text="Enter a short description.",
        null=True,
        blank=True
    )
    image = RichTextUploadingField(
        verbose_name="Image",
        help_text="Upload image.",
        null=True,
        blank=True
    )
    body = RichTextUploadingField(
        verbose_name="Body",
        help_text="Enter the full content.",
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = "Page Header Content"
        verbose_name_plural = "Page Header Contents"
        ordering = ['-id']

    def __str__(self):
        return strip_tags(self.title) or "Page Content"
