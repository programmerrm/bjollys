from django.contrib import admin
from django.contrib.auth.hashers import make_password
from accounts.models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'name', 'email', 'number', 'role', 'local_ip', 'is_active', 'is_block', 'date_joined']
    # exclude = ['groups', 'user_permissions']

    def save_model(self, request, obj, form, change):
        if form.cleaned_data.get("password") and not obj.password.startswith("pbkdf2_"):
            obj.password = make_password(form.cleaned_data["password"])
        super().save_model(request, obj, form, change)

# Register your models
admin.site.register(User, UserAdmin)
