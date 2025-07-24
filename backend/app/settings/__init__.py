###################################################
"""
Environment-based settings loader.

Depending on the ENV environment variable, this file loads
either development or production settings dynamically.

Set ENV=dev   → Loads development settings from app.settings.dev  
Set ENV=prod  → Loads production settings from app.settings.prod

If ENV is not set correctly, an exception is raised.
"""
###################################################
import os

app_env = os.environ.get('ENV', 'dev')

if app_env == 'dev':
    from app.settings.dev import *
elif app_env == 'prod':
    from app.settings.prod import *
else:
    raise Exception(f'❌ Unknown ENV value: {app_env}. Please set ENV to one of: dev, prod.')
