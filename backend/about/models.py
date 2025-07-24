from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.translation import gettext_lazy as _
from django.utils.html import strip_tags

class About(models.Model):
    video = models.FileField(
        upload_to='about/videos/',
        null=True,
        blank=True,
        verbose_name=_('About Video'),
        help_text=_('Upload a video file (MP4, AVI, etc.) to show in the About section.'),
    )
    title = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_('About Title'),
        help_text=_('Enter the title or heading for the About section.'),
    )
    description = RichTextUploadingField(
        null=True,
        blank=True,
        verbose_name=_('About Description'),
        help_text=_('Provide a detailed description about your organization or purpose.'),
    )

    class Meta:
        verbose_name = _("About Section")
        verbose_name_plural = _("About Sections")
        ordering = ['-id']

    def save(self, *args, **kwargs):
        if not self.pk:
            About.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"About Section: {strip_tags(self.title)[:50] or 'Untitled'}"
