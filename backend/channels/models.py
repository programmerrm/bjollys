from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.translation import gettext_lazy as _
from django.utils.html import strip_tags

# Create your models here.

class Channels(models.Model):
    video = models.FileField(
        upload_to='channels/videos/',
        null=True,
        blank=True,
        verbose_name=_("Channel Video"),
        help_text=_("Upload a video file (e.g., MP4, AVI) for this channel.")
    )
    title = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_("Channel Title"),
        help_text=_("Enter the title or name of the channel."),
    )
    insta_broadcast = models.URLField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_("Instagram Broadcast URL"),
        help_text=_("Enter the broadcast URL for Instagram."),
    )
    fb_broadcast = models.URLField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_("Facebook Broadcast URL"),
        help_text=_("Enter the broadcast URL for Facebook."),
    )
    description = RichTextUploadingField(
        null=True,
        blank=True,
        verbose_name=_("Channel Description"),
        help_text=_("Write a brief description of this channel."),
    )

    class Meta:
        verbose_name = _("Channel")
        verbose_name_plural = _("Channels")
        ordering = ['-id']

    def save(self, *args, **kwargs):
        if not self.pk:
            Channels.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Channel: {strip_tags(self.title)[:50] or 'Untitled'}"
