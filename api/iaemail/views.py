from rest_framework import viewsets, response, status, serializers
from .models import EmailClassification
from .serializers import EmailClassificationSerializer
from ia_email_classifier import IaEmailClassifier
from utils.upload_file import upload_file

class EmailClassificationView(viewsets.ModelViewSet):
    queryset = EmailClassification.objects.all()
    serializer_class = EmailClassificationSerializer

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
        serializer.save()

        return response.Response(serializer.data, status=status.HTTP_201_CREATED)

