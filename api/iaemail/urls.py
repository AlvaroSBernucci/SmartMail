from rest_framework import routers
from .views import EmailClassificationView

router = routers.SimpleRouter()
router.register("emails", EmailClassificationView, basename="emails")

urlpatterns = router.urls