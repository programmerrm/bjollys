from django.contrib import admin
from crouses.models import Ecommerce, Crypto, MarketUpdates, Education, StockTrades, EcommerceSingleCourse, SingleCourseBundle

class SingleCourseBundleAdmin(admin.TabularInline):
    model = SingleCourseBundle
    extra = 1

class EcommerceSingleCourseAdmin(admin.ModelAdmin):
    list_display = ['title']
    inlines = [SingleCourseBundleAdmin]

# Register your models here.
admin.site.register(Ecommerce)
admin.site.register(Crypto)
admin.site.register(StockTrades)
admin.site.register(MarketUpdates)
admin.site.register(Education)
admin.site.register(EcommerceSingleCourse, EcommerceSingleCourseAdmin)
