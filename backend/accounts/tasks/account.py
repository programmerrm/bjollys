# import logging
# from celery import shared_task
# from django.contrib.auth import get_user_model
# from accounts.models import ActiveSession

# logger = logging.getLogger(__name__)
# User = get_user_model()

# @shared_task
# def create_active_session(user_id, ip_address, user_agent):
#     try:
#         logger.info(f"Running create_active_session for user_id={user_id}")
#         user = User.objects.get(pk=user_id)
#         ActiveSession.objects.update_or_create(
#             user=user,
#             defaults={
#                 'ip_address': ip_address,
#                 'user_agent': user_agent
#             }
#         )
#         logger.info(f"ActiveSession created for user {user.email} with IP {ip_address}")
#         return f"ActiveSession created for user {user.email}"
#     except User.DoesNotExist:
#         logger.error(f"User with id {user_id} does not exist")
#         return f"User with id {user_id} does not exist"
#     except Exception as e:
#         logger.error(f"Error in create_active_session: {e}")
#         raise e
