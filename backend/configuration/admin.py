from django.contrib import admin
from configuration.models import Logo, FooterLogo, ContactInfo, Copyright, LegalDisclaimer, WebsiteName, SocialLink

# Register your models here.
admin.site.register(Logo)
admin.site.register(FooterLogo)
admin.site.register(ContactInfo)
admin.site.register(LegalDisclaimer)
admin.site.register(Copyright)
admin.site.register(WebsiteName)
admin.site.register(SocialLink)
