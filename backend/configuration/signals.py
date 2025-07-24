from django.db.models.signals import post_delete, pre_delete
from django.dispatch import receiver
from configuration.models import Logo, FooterLogo

# === POST DELETE: Delete logo image from storage ===
@receiver(post_delete, sender=Logo)
def delete_logo_image_file(sender, instance, **kwargs):
    if instance.logo:
        instance.logo.delete(save=False)
    
# === POST DELETE: Delete footer logo image from storage ===
@receiver(post_delete, sender=FooterLogo)
def delete_logo_image_file(sender, instance, **kwargs):
    if instance.logo:
        instance.logo.delete(save=False)
