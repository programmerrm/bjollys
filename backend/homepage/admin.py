from django.contrib import admin
from homepage.models import Banner, Team, WhyChooseUs

class BannderAdmin(admin.ModelAdmin):
    list_display = ['title', 'sub_title', 'description', 'our_channel_url']

# Register your models here.
admin.site.register(Banner, BannderAdmin)
admin.site.register(Team)
admin.site.register(WhyChooseUs)
