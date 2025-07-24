from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Ecommerce(models.Model):
    title = models.CharField(max_length=255)
    video = models.FileField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('E-commerce Course')
        verbose_name_plural = _('E-commerce Courses')
        ordering = ['-id']

    def __str__(self):
        return f'{self.id} - {self.title}'
    
    def clean(self):
        MAX_SIZE = 2147483648
        if self.video and self.video.size > MAX_SIZE:
            raise ValidationError(_('The video file size cannot exceed 2GB.'))

class Crypto(models.Model):
    images = models.ImageField()
    video = models.FileField()
    title = models.CharField(verbose_name=_('Title'), max_length=500,)
    description = RichTextUploadingField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Crypto Course')
        verbose_name_plural = _('Crypto Courses')
        ordering = ['-id']

    def __str__(self):
        return self.title
    
    def clean(self):
        MAX_SIZE = 2147483648
        if self.video and self.video.size > MAX_SIZE:
            raise ValidationError(_('The video file size cannot exceed 2GB.'))

class StockTrades(models.Model):
    images = models.ImageField()
    video = models.FileField()
    title = models.CharField(verbose_name=_('Title'), max_length=500,)
    description = RichTextUploadingField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Stock Trades Course')
        verbose_name_plural = _('Stock Trades Courses')
        ordering = ['-id']

    def __str__(self):
        return self.title
    
    def clean(self):
        MAX_SIZE = 2147483648
        if self.video and self.video.size > MAX_SIZE:
            raise ValidationError(_('The video file size cannot exceed 2GB.'))

class MarketUpdates(models.Model):
    images = models.ImageField()
    video = models.FileField()
    title = models.CharField(verbose_name=_('Title'), max_length=500,)
    description = RichTextUploadingField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Market Updates Course')
        verbose_name_plural = _('Market Updates Courses')
        ordering = ['-id']

    def __str__(self):
        return self.title
    
    def clean(self):
        MAX_SIZE = 2147483648
        if self.video and self.video.size > MAX_SIZE:
            raise ValidationError(_('The video file size cannot exceed 2GB.'))

EDUCATIONVIDEOSTATUS = [
    ('advance', 'Advance'),
    ('basic', 'Basic'),
]

class Education(models.Model):
    title = models.CharField(verbose_name=_('Title'), max_length=500,)
    video = models.FileField()
    status = models.CharField(max_length=20,choices=EDUCATIONVIDEOSTATUS,verbose_name=_('Status'))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Education Video')
        verbose_name_plural = _('Education Videos')

    def __str__(self):
        return self.title
    
    def clean(self):
        MAX_SIZE = 2147483648
        if self.video and self.video.size > MAX_SIZE:
            raise ValidationError(_('The video file size cannot exceed 2GB.'))
