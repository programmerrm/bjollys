from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.translation import gettext_lazy as _
from django.utils.html import strip_tags

# Create your models here.

class Banner(models.Model):
    title = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_('Banner Title'),
        help_text=_('Enter the main title of the banner.'),
    )
    sub_title = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_('Banner Sub-Title'),
        help_text=_('Enter the subtitle of the banner.'),
    )
    description = RichTextUploadingField(
        null=True,
        blank=True,
        verbose_name=_('Banner Description'),
        help_text=_('Enter a brief description about the banner.'),
    )
    see_more_description = RichTextUploadingField(
        null=True,
        blank=True,
        verbose_name=_('See More Description'),
        help_text=_('Enter a brief see more description.'),
    )
    our_channel_url = models.URLField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_('Our Channel Url'),
        help_text=_('Provide the link to your our channel url (optional).'),
    )
    video = models.FileField(
        upload_to='banners/videos/',
        null=True,
        blank=True,
        verbose_name=_('Banner Video'),
        help_text=_('Upload a promotional video (MP4, AVI, etc).'),
    )

    class Meta:
        verbose_name = _('Banner')
        verbose_name_plural = _('Banner')

    def save(self, *args, **kwargs):
        if not self.pk:
            Banner.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Banner: {strip_tags(self.title)[:50] or 'Untitled'}"

class Team(models.Model):
    image = models.ImageField(
        upload_to='homepage/temas/',
        null=True,
        blank=True,
        verbose_name=_('Team Image'),
        help_text=_('Upload an image representing the team or a team member.'),
    )

    title = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_('Team Title'),
        help_text=_('Enter the title or name of the team or member.'),
    )

    description = RichTextUploadingField(
        null=True,
        blank=True,
        verbose_name=_('Team Description'),
        help_text=_('Provide a brief description of the team or member.'),
    )

    url = models.URLField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_('Team Profile URL'),
        help_text=_('Provide a relevant link, such as a LinkedIn or portfolio URL.'),
    )

    class Meta:
        verbose_name = _('Team Member')
        verbose_name_plural = _('Team Members')
        ordering = ['-id']

    def __str__(self):
        return f"Team Member: {strip_tags(self.title)[:50] or 'Untitled'}"

class WhyChooseUs(models.Model):
    image = models.ImageField(
        upload_to='homepage/why-choose-us/',
        null=True,
        blank=True,
        verbose_name=_('WhyChooseUs Image'),
        help_text=_('Upload your whychooseus image...'),
    )
    sub_image = models.ImageField(
        upload_to='homepage/why-choose-us/',
        null=True,
        blank=True,
        verbose_name=_('WhyChooseUs Sub-Image'),
        help_text=_('Upload your whychooseus-sub image...'),
    )
    title = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_('WhyChooseUs Title'),
        help_text=_('Enter your whychooseus title...'),
    )
    description = RichTextUploadingField(
        null=True,
        blank=True,
        verbose_name=_('WhyChooseUs description'),
        help_text=_('Enter your whychooseus description...'),
    )

    class Meta:
        verbose_name = _('Why Choose Us')
        verbose_name_plural = _('Why Choose Us')
        ordering = ['-id']

    def __str__(self):
        return f'Why Choose Us added'
