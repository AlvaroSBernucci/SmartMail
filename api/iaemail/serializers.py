from rest_framework import serializers
from .models import EmailClassification

class EmailClassificationSerializer(serializers.ModelSerializer):
    classification_label = serializers.CharField(source='get_classification_display', read_only=True)
    priority_label = serializers.CharField(source='get_priority_display', read_only=True)
    created_at = serializers.DateTimeField(format="%d/%m/%y")
    
    class Meta:
        model = EmailClassification
        fields = [
            'id',
            'original_text',
            'ia_suggestion_text',
            'classification',
            'priority',
            'classification_label',
            'priority_label',
            'created_at'
        ]
