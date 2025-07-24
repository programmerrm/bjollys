###########################################################
"""
Development settings configuration
"""
###########################################################
from app.settings.base import *
from datetime import timedelta

DEBUG = True

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'localhost:3000', 
    '127.0.0.1:8000',
    'api.bjollys.net',
    'bjollys.net',
]

SECRET_KEY = 'django-insecure-4%gu)qu8u+wms*+#psj)c$pc^l!u3ntj@osqpb!2l!t+qo+x55'

INSTALLED_APPS += [
    'schema_viewer',
    'drf_spectacular',
    'drf_spectacular_sidecar',
]

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'bjollys_database',
        'USER': 'bjollys',
        'PASSWORD': 'bjollyRasel77@',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://localhost:5173',
    'https://api.bjollys.net',
    'https://www.bjollys.net',
    'https://bjollys.net',
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'https://api.bjollys.net',
    'https://www.bjollys.net',
    'https://bjollys.net',
]

REST_FRAMEWORK['DEFAULT_SCHEMA_CLASS'] = 'drf_spectacular.openapi.AutoSchema'

SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'] = timedelta(days=7)
SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'] = timedelta(days=30)

SPECTACULAR_SETTINGS = {
    'TITLE': 'Bijolis-E-Learning Project API',
    'DESCRIPTION': (
        'This is the API documentation for the development version of the bijolis-e-learning project.'
        'It provides endpoints for authentication, user management, and business logic that power '
        'the dashboard and client-facing features during the development phase.'
    ),
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
}
