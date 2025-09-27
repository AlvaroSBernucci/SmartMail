from django.db import models

class EmailClassification(models.Model):
    class ClassificationChoices(models.IntegerChoices):
        PRODUCTIVE = 1, "Produtivo"
        UNPRODUCTIVE = 2, "Improdutivo"

    class PriorityChoices(models.IntegerChoices):
        HIGHT = 1, "Alta prioridade"
        MEDIUM = 2, "Média prioridade"
        LOW = 3, "Baixa prioridade"
        NONE = 0, 'N/A'

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

    def __str__(self):
        return f"{self.pk} - {self.classification} - {self.priority}"