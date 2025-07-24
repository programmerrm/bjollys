from rest_framework.throttling import SimpleRateThrottle, UserRateThrottle

class IPTHROTTLE(SimpleRateThrottle):
    scope  = 'ip'
    def get_cache_key(self, request, view):
        ip_address = self.get_ident(request)
        return self.cache_format % {
            'scope': self.scope,
            'ident': ip_address
        }
    
class REGISTER_RATE_LIMIT(UserRateThrottle):
    scope = 'register'

    def __init__(self):
        self.rate = '100/min'
        super().__init__()
        