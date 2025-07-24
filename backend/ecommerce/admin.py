from django.contrib import admin
from ecommerce.models import Image, Video, Amazon, CourseDetails, Booking, WhatsAppNumber, YoutubeLink, FAQ, EcommerceServices

# Register your models here.
admin.site.register(Image)
admin.site.register(Video)
admin.site.register(Amazon)
admin.site.register(CourseDetails)
admin.site.register(Booking)
admin.site.register(WhatsAppNumber)
admin.site.register(YoutubeLink)
admin.site.register(FAQ)
admin.site.register(EcommerceServices)
