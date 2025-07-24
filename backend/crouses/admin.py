from django.contrib import admin
from crouses.models import Ecommerce, Crypto, MarketUpdates, Education, StockTrades

# Register your models here.
admin.site.register(Ecommerce)
admin.site.register(Crypto)
admin.site.register(StockTrades)
admin.site.register(MarketUpdates)
admin.site.register(Education)
