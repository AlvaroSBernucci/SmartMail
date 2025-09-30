import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User

SUPERUSER_NAME = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
SUPERUSER_EMAIL = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
SUPERUSER_PASSWORD = os.getenv("DJANGO_SUPERUSER_PASSWORD", "admin")

if not User.objects.filter(username=SUPERUSER_NAME).exists():
    User.objects.create_superuser(SUPERUSER_NAME, SUPERUSER_EMAIL, SUPERUSER_PASSWORD)
    print(f"Superuser {SUPERUSER_NAME} criado!")
else:
    print(f"Superuser {SUPERUSER_NAME} já existe.")
