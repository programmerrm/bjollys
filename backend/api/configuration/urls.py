from django.urls import path
from api.configuration.views.logo import LogoViewSet
from api.configuration.views.footer_logo import FooterLogoViewSet
from api.configuration.views.legal_disclaimer import LegalDisclaimerViewSet
from api.configuration.views.website_name import WebsiteNameViewSet
from api.configuration.views.copyright import CopyrightViewSet
from api.configuration.views.social_link import SocialLinkViewSet
from api.configuration.views.contact_info import ContactInfoViewSet
from api.configuration.views.ticket import CreateTickerViewSet, TickerViewSet

urlpatterns = [
    path(
        'create-ticker/',
        CreateTickerViewSet.as_view({ 'post': 'create' }),
        name='create_ticker',
    ),
    path(
        'ticker/',
        TickerViewSet.as_view({ 'get': 'list' }),
        name='ticker',
    ),
    path(
        'logo/',
        LogoViewSet.as_view({ 'get': 'list' }),
        name='logo',
    ),
    path(
        'footer-logo/',
        FooterLogoViewSet.as_view({ 'get': 'list' }),
        name='footer_logo',
    ),
    path(
        'legal-disclaimer/',
        LegalDisclaimerViewSet.as_view({ 'get': 'list' }),
        name='legal_disclaimer'
    ),
    path(
        'website-name/',
        WebsiteNameViewSet.as_view({ 'get': 'list' }),
        name='website_name',
    ),
    path(
        'copy-right/',
        CopyrightViewSet.as_view({ 'get': 'list' }),
        name='copy_right',
    ),
    path(
        'social-link',
        SocialLinkViewSet.as_view({ 'get': 'list' }),
        name='social_link',
    ),
    path(
        'contact-info/',
        ContactInfoViewSet.as_view({ 'get': 'list' }),
        name='contact_info',
    ),
]
