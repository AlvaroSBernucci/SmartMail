from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailClassification(models.Model):
    class ClassificationChoices(models.IntegerChoices):
        PRODUCTIVE = 1, "Produtivo"
        UNPRODUCTIVE = 2, "Improdutivo"

    class PriorityChoices(models.IntegerChoices):
        HIGHT = 1, "Alta prioridade"
        MEDIUM = 2, "Média prioridade"
        LOW = 3, "Baixa prioridade"
        NONE = 0, "N/A"

    classification = models.IntegerField(
        choices=ClassificationChoices.choices,
        null=True,
        blank=True
    )
    priority = models.IntegerField(
        choices=PriorityChoices.choices,
        null=True,
        blank=True
    )
    original_text = models.TextField()
    ia_suggestion_text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="email_classifications",
        null=True,
        blank=True 
    )

    def __str__(self):
        classification_label = self.get_classification_display() if self.classification is not None else "N/A"
        priority_label = self.get_priority_display() if self.priority is not None else "N/A"
        return f"{classification_label} - {priority_label}"

