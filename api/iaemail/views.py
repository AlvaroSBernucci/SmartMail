from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from .models import EmailClassification
from .serializers import EmailClassificationSerializer
from ia_email_classifier import IaEmailClassifier
from rest_framework.permissions import IsAuthenticated
from utils.upload_file import upload_file

class EmailClassificationView(viewsets.ModelViewSet):
    queryset = EmailClassification.objects.all().order_by('-created_at')
    serializer_class = EmailClassificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

    def create(self, request):
        file_upload = request.data.get("upload")
        file_obj = request.FILES.get("file")
        base_url = "https://router.huggingface.co/v1"
        model = "moonshotai/Kimi-K2-Instruct-0905"
        required_keys = ["classification", "priority", "original_text", "ia_suggestion_text"]
        if not file_upload:
            email = request.data.get("original_text")
        elif file_upload and file_obj:
            email = upload_file(file_obj)
        else:
            return response.Response({"error": f"Nenhum email enviado"}, status=status.HTTP_400_BAD_REQUEST)
        
        classifier = IaEmailClassifier(base_url, model, email)
        ia_response = classifier.get_answer()
        print(ia_response)
        missing = [key for key in required_keys if key not in ia_response]

        if missing:
            return response.Response({"error": f"Campos ausentes na resposta da IA: {','.join(missing)}"})
        print(ia_response)

        data = {
            "classification": ia_response.get("classification"),
            "priority": ia_response.get("priority"),
            "original_text": ia_response.get("original_text"),
            "ia_suggestion_text": ia_response.get("ia_suggestion_text"),
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user)
        serializer.save()

        return response.Response(serializer.data, status=status.HTTP_201_CREATED)
    


    
    @action(methods=['GET'], detail=False, url_path="get-summarize")
    def get_summarize(self, request):
        queryset = self.get_queryset()
        email_count = queryset.count()
        productive_percentage = queryset.filter(classification=1).count()
        productive_percentage = int(round((productive_percentage / email_count * 100),0))
        hight_priority_count = queryset.filter(priority=1).count()
        medium_priority_count = queryset.filter(priority=2).count()
        low_priority_count = queryset.filter(priority=3).count()

        data = [
            {
                "title": "Emails Analisados",
                "value": email_count,
                "icon": "faEnvelope",
                "color": "black"
            },
            {
                "title": "Taxa de Produtivos",
                "value": f"{productive_percentage}%",
                "icon": "faArrowUp",
                "color": "black"
            },
            {
                "title": "Emails de Alta Prioridade",
                "value": hight_priority_count,
                "icon": "faTriangleExclamation",
                "color": "red"
            },
            {
                "title": "Emails de Média Prioridade",
                "value": medium_priority_count,
                "icon": "faTriangleExclamation",
                "color": "#D19200"
            },
            {
                "title": "Emails de Baixa Prioridade",
                "value": low_priority_count,
                "icon": "faTriangleExclamation",
                "color": "#24821F"
            },
        ]
        return response.Response(data)

