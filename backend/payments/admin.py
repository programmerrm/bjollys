from django.contrib import admin
from payments.models import Subscription, Payment

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'start_date', 'next_billing_date', 'is_recurring')
    search_fields = ('user__name', 'status')
    list_filter = ('status',)

class PaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'currency', 'payment_date', 'status')
    search_fields = ('user__name', 'status')
    list_filter = ('status',)

# Register your models here.
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Payment, PaymentAdmin)
