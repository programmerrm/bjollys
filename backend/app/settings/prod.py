###########################################################
"""
Production settings configuration
"""
###########################################################
from app.settings.base import *
from datetime import timedelta

DEBUG = False
ALLOWED_HOSTS = ['bjollys.net', 'api.bjollys.net']
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', None)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CSRF_TRUSTED_ORIGINS = [
    'https://bjollys.net', 
    'https://api.bjollys.net',
]

SIMPLE_JWT.update({
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "SIGNING_KEY": os.getenv('DJANGO_SECRET_KEY'),
})

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://bjollys.net",
    "https://api.bjollys.net",
]
