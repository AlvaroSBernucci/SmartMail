from rest_framework import serializers
from .models import EmailClassification

class EmailClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailClassification
        fields = "__all__"