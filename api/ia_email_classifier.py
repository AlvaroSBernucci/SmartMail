import os
from openai import OpenAI
import json


class IaEmailClassifier:
    def __init__(self, base_url, model, email):
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

    def _build_prompt(self):
        return f"""Você é uma inteligência artificial especializada em processamento de linguagem natural, projetada para analisar emails e fornecer classificações e respostas automáticas. Receba o texto de um email como entrada e siga estas instruções:
        1. Classifique o email em uma das duas categorias: "Produtivo (1)" (se requerir ação ou resposta específica, como solicitações de suporte, atualizações de casos ou dúvidas sobre sistemas) ou "Improdutivo (2)" (se não necessitar de ação imediata, como mensagens de felicitações ou agradecimentos).
        2. Para emails classificados como "Produtivo", determine uma prioridade de resposta: "Alta prioridade (1)" para casos urgentes, "Média prioridade (2)" para questões moderadas, ou "Baixa prioridade (3)" para tarefas menos críticas. Para "Improdutivo", defina "priority" como 0.
        3. Mantenha o "original_text" como o texto completo do email fornecido.
        4. Gere uma "ia_suggestion_text" apropriada baseada na classificação e, se aplicável, na prioridade. A resposta deve ser clara, profissional e adaptada ao contexto do email.

        Retorne o resultado exclusivamente no seguinte formato JSON:
        {{
            "classification": "1",
            "priority": "1",
            "original_text": "conteudo original do e-mail",
            "ia_suggestion_text": "resposta sugerida pela IA"
        }}

        Agora, analise o seguinte email e forneça a resposta no formato JSON especificado:
        {self.email}"""

    def get_answer(self):
        if not self.client:
            raise RuntimeError("Cliente não inicializado. Verifique a configuração.")
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Você é um assistente de classificação de emails."},
                    {"role": "user", "content": self._build_prompt()}
                ],
                max_tokens=200
            )
            answer = response.choices[0].message.content
            return json.loads(answer)
        except Exception as e:
            raise Exception(f"Erro ao consultar a IA: {str(e)}")

if __name__ == "__main__":
    base_url = "https://router.huggingface.co/v1"
    model = "moonshotai/Kimi-K2-Instruct-0905"
    email = "Prezado suporte, gostaria de saber o status do meu caso #123. Obrigado!"
    
    classifier = IaEmailClassifier(base_url, model, email)
    result = classifier.get_answer()
    print(result)