import os
import json
import string
from openai import OpenAI

class IaEmailClassifier:
    def __init__(self, base_url: str, model: str, email: str):
        self.email = email
        self.base_url = base_url
        self.model = model
        self.api_key = os.getenv("HL_TOKEN")
        self.client = None
        self._create_client()

    def _create_client(self):
        if not self.api_key:
            raise ValueError("A chave de API (HL_TOKEN) não foi encontrada nas variáveis de ambiente.")
        self.client = OpenAI(
            base_url=self.base_url,
            api_key=self.api_key,
        )

    def _preprocess_email(self, email: str) -> str:
        stop_words = {
            "de", "a", "o", "e", "para", "com", "um", "uma", "os", "as",
            "dos", "das", "no", "na", "nos", "nas", "por", "pelo", "pela",
            "que", "se", "em", "ao", "à"
        }

        def simple_stem(word: str) -> str:
            suffixes = ["ando", "endo", "ar", "er", "ir", "s", "mente"]
            for suf in suffixes:
                if word.endswith(suf):
                    return word[:-len(suf)]
            return word

        email = email.lower()
        email = email.translate(str.maketrans("", "", string.punctuation))
        tokens = [word for word in email.split() if word not in stop_words]
        tokens = [simple_stem(word) for word in tokens]
        return " ".join(tokens)

    def _build_prompt(self) -> str:
        safe_email = self.email.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
        processed_email = self._preprocess_email(self.email)

        return f"""
                Você é uma IA especializada em classificação de emails. Analise o email fornecido abaixo e retorne **apenas JSON válido**, sem explicações ou texto adicional.

                Email para análise:
                "{safe_email}"

                Instruções:
                1. Classifique o email em "Produtivo (1)" ou "Improdutivo (2)".
                2. Para produtivo, determine a prioridade: "Alta (1)", "Média (2)" ou "Baixa (3)". Para improdutivo, prioridade = 0.
                3. Mantenha "original_text" exatamente igual ao texto do email fornecido.
                4. Gere "ia_suggestion_text" adequada à classificação e prioridade.

                Formato do JSON esperado:
                {{
                    "classification": 1,
                    "priority": 1,
                    "original_text": "...",
                    "ia_suggestion_text": "..."
                }}

                Analise o email pré-processado (para referência interna):
                {processed_email}
                """

    def get_answer(self) -> dict:
        if not self.client:
            raise RuntimeError("Cliente não inicializado. Verifique a configuração.")
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Você é um assistente de classificação de emails."},
                    {"role": "user", "content": self._build_prompt()}
                ],
                max_tokens=400
            )
            answer = response.choices[0].message.content
            return json.loads(answer)
        except Exception as e:
            raise Exception(f"Erro ao consultar a IA: {str(e)}")

