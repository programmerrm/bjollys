from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Image(models.Model):
    image = models.ImageField(upload_to='uploads/images/', verbose_name=_("Image"))

    class Meta:
        verbose_name = _("Image")
        verbose_name_plural = _("Images")
        ordering = ["id"]

    def __str__(self):
        return self.image.name if self.image else "No Image"

class Video(models.Model):
    video = models.FileField(upload_to='uploads/videos/', verbose_name=_("Video"))

    class Meta:
        verbose_name = _("Video")
        verbose_name_plural = _("Videos")
        ordering = ["id"]

    def __str__(self):
        return self.video.name if self.video else "No Video"

class Amazon(models.Model):
    title = models.CharField(max_length=255, verbose_name=_("Title"))

    class Meta:
        verbose_name = _("Amazon Item")
        verbose_name_plural = _("Amazon Items")
        ordering = ["id"]

    def __str__(self):
        return self.title

class CourseDetails(models.Model):
    title = models.CharField(max_length=255, verbose_name=_("Course Title"))
    description = RichTextUploadingField(verbose_name=_("Course Description"))

    class Meta:
        verbose_name = _("Course Detail")
        verbose_name_plural = _("Course Details")
        ordering = ["id"]

    def __str__(self):
        return self.title

class Booking(models.Model):
    name = models.CharField(max_length=100, verbose_name=_("Name"))
    number = models.CharField(max_length=20, verbose_name=_("Phone Number"))
    country_name = models.CharField(max_length=100, verbose_name=_("Country"))
    message = models.TextField(verbose_name=_("Message"))

    class Meta:
        verbose_name = _("Booking")
        verbose_name_plural = _("Bookings")
        ordering = ["-id"]

    def __str__(self):
        return f"{self.name} ({self.number})"

class WhatsAppNumber(models.Model):
    number = models.CharField(max_length=20, verbose_name=_("WhatsApp Number"))

    class Meta:
        verbose_name = _("WhatsApp Number")
        verbose_name_plural = _("WhatsApp Numbers")
        ordering = ["id"]

    def __str__(self):
        return self.number

class YoutubeLink(models.Model):
    link = models.URLField(verbose_name=_("YouTube Link"))

    class Meta:
        verbose_name = _("YouTube Link")
        verbose_name_plural = _("YouTube Links")
        ordering = ["id"]

    def __str__(self):
        return self.link

class FAQ(models.Model):
    question = models.CharField(max_length=500, verbose_name=_("Question"), )
    answer = RichTextUploadingField(verbose_name=_("Answer"))

    class Meta:
        verbose_name = _("FAQ")
        verbose_name_plural = _("FAQs")
        ordering = ["id"]

    def __str__(self):
        return self.question[:50]

class EcommerceServices(models.Model):
    title = models.CharField(max_length=500,verbose_name=_("Title"), )
    description = RichTextUploadingField(verbose_name=_("Description"))
    price = models.CharField(max_length=100, verbose_name=_("Price"),)

    class Meta:
        verbose_name = _("Ecommerce Service")
        verbose_name_plural = _("Ecommerce Services")
        ordering = ["id"]

    def __str__(self):
        return f"{self.title[:50]} - {self.price}"
