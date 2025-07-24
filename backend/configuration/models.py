from django.db import models
from django.utils.text import slugify
from django.utils.html import strip_tags
from ckeditor_uploader.fields import RichTextUploadingField
from configuration.utils.logo_upload import LOGO_DIRECTORY_PATH
from core.utils import VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE, VALIDATE_EMAIL, VALIDATE_PHONE_NUMBER
from django.utils.translation import gettext_lazy as _

def GENERATE_SLUG(value):
    return slugify(strip_tags(value))

class HeaderMenu(models.Model):
    name = RichTextUploadingField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_("Header Menu Name"),
        help_text=_("Enter the name or content for the header menu (with optional icons or styling)."),
    )

    slug = models.SlugField(
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        verbose_name=_("Slug"),
        help_text=_("Auto-generated from the menu name."),
    )

    class Meta:
        verbose_name = _("Header Menu")
        verbose_name_plural = _("Header Menus")
        ordering = ['-id']

    def save(self, *args, **kwargs):
        if self.name and not self.slug:
            self.slug = GENERATE_SLUG(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return strip_tags(self.name) or "Header Menu"

class FooterMenu(models.Model):
    name = RichTextUploadingField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_("Footer Menu Name"),
        help_text=_("Enter the name or content for the footer menu (with optional icons or styling)."),
    )

    slug = models.SlugField(
        editable=False,
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        verbose_name=_("Slug"),
        help_text=_("Auto-generated from the menu name."),
    )

    class Meta:
        verbose_name = _("Footer Menu")
        verbose_name_plural = _("Footer Menus")
        ordering = ['-id']

    def save(self, *args, **kwargs):
        if self.name and not self.slug:
            self.slug = GENERATE_SLUG(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return strip_tags(self.name) or "Footer Menu"

class WebsiteName(models.Model):
    name = models.CharField(
        max_length=280,
        null=True,
        blank=True,
        verbose_name=_('Website Name'),
        help_text=_('Enter your website name'),
    )

    class Meta:
        verbose_name = _('Website Name')
        verbose_name_plural = _('Website Name')

    def save(self, *args, **kwargs):
        if not self.pk:
            WebsiteName.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name or 'Your website name'

class Logo(models.Model):
    logo = models.ImageField(
        upload_to=LOGO_DIRECTORY_PATH,
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        null=True,
        blank=True,
        verbose_name=_('Logo'),
        help_text=_('Upload your logo...'),
    )

    class Meta:
        verbose_name = _('Logo')
        verbose_name_plural = _('Logo')

    def save(self, *args, **kwargs):
        if not self.pk:
            Logo.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Your logo name {self.logo.name}' or f'Your logo data added'

class FooterLogo(models.Model):
    logo = models.ImageField(
        upload_to=LOGO_DIRECTORY_PATH,
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        null=True,
        blank=True,
        verbose_name=_('Logo'),
        help_text=_('Upload your logo...'),
    )
    description = RichTextUploadingField(
        max_length=250,
        null=True,
        blank=True,
        verbose_name=_('Footer description'),
        help_text=_('Enter your description...'),
    )

    class Meta:
        verbose_name = _('Footer Logo')
        verbose_name_plural = _('Footer Logo')

    def save(self, *args, **kwargs):
        if not self.pk:
            FooterLogo.objects.all().delete()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f'Your footer logo name {self.logo.name}' or 'Your footer logo data added'

class ContactInfo(models.Model):
    address = models.CharField(
        max_length=280,
        null=True,
        blank=True,
        verbose_name=_('Address'),
        help_text=_('Enter your address...'),
    )
    email = models.EmailField(
        max_length=180,
        validators=[VALIDATE_EMAIL],
        null=True,
        blank=True,
        verbose_name=_('Email'),
        help_text=_('Enter your email address...'),
    )
    number = models.CharField(
        max_length=20,
        validators=[VALIDATE_PHONE_NUMBER],
        null=True,
        blank=True,
        verbose_name=_('Number'),
        help_text=_('Enter your number...'),
    )

    class Meta:
        verbose_name = _('Contact Info')
        verbose_name_plural = _('Contact Info')

    def save(self, *args, **kwargs):
        if not self.pk:
            ContactInfo.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Your website {self.address} & email address {self.email}' or f'Your website contact info'

class SocialLink(models.Model):
    facebook = models.URLField(
        null=True,
        blank=True,
        verbose_name=_('Facebook Link'),
        help_text=_('You can paste a link or add styled text with icon.'),
    )
    instagram = models.URLField(
        null=True,
        blank=True,
        verbose_name=_('Instagram Link'),
        help_text=_('You can paste a link or add styled text with icon.'),
    )
    twitter = models.URLField(
        null=True,
        blank=True,
        verbose_name=_('Twitter Link'),
        help_text=_('You can paste a link or add styled text with icon.'),
    )
    linkedin = models.URLField(
        null=True,
        blank=True,
        verbose_name=_('LinkedIn Link'),
        help_text=_('You can paste a link or add styled text with icon.'),
    )

    class Meta:
        verbose_name = _('Social Link')
        verbose_name_plural = _('Social Links')

    def save(self, *args, **kwargs):
        if not self.pk:
            SocialLink.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Your website socal link added'

class Copyright(models.Model):
    text = models.TextField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_('Copyright'),
        help_text=_('Enter your website copyright text...'),
    )

    class Meta:
        verbose_name = _('Copyright')
        verbose_name_plural = _('Copyright')

    def save(self, *args, **kwargs):
        if not self.pk:
            Copyright.objects.all().delete()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f'Your Copy rigth text added'

class LegalDisclaimer(models.Model):
    title = models.CharField(
        max_length=280,
        null=True,
        blank=True,
        verbose_name=_("Title"),
        help_text=_("Enter the title of the legal disclaimer."),
    )
    updated_date = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_("Updated Date"),
        help_text=_("Specify the last updated date of the disclaimer."),
    )
    short_description = models.TextField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_("Short Description"),
        help_text=_("Enter a brief summary of the disclaimer."),
    )
    description = RichTextUploadingField(
        null=True,
        blank=True,
        verbose_name=_("Full Description"),
        help_text=_("Write the full content of the legal disclaimer."),
    )

    class Meta:
        verbose_name = _("Legal Disclaimer")
        verbose_name_plural = _("Legal Disclaimer")

    def save(self, *args, **kwargs):
        if not self.pk:
            LegalDisclaimer.objects.all().delete()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title or "Legal Disclaimer"
