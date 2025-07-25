from django.contrib import admin
from configuration.models import Logo, FooterLogo, ContactInfo, Copyright, LegalDisclaimer, WebsiteName, SocialLink, WelcomeEmailTemplate, CryptoEmailTemplate, EcommerceEmailTemplate, HeaderMenu, Ticket

# Register your models here.
admin.site.register(Ticket)
admin.site.register(HeaderMenu)
admin.site.register(Logo)
admin.site.register(FooterLogo)
admin.site.register(ContactInfo)
admin.site.register(LegalDisclaimer)
admin.site.register(Copyright)
admin.site.register(WebsiteName)
admin.site.register(SocialLink)
admin.site.register(WelcomeEmailTemplate)
admin.site.register(CryptoEmailTemplate)
admin.site.register(EcommerceEmailTemplate)
