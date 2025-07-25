from django.views.generic import TemplateView
from configuration.models import WelcomeEmailTemplate

class WelcomeEmailTemplateView(TemplateView):
    template_name = 'emails/registration_welcome.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['template'] = WelcomeEmailTemplate.objects.first()
        return context
