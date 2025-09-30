### SmartMail — Case Prático AutoU

SmartMail é uma aplicação web que utiliza IA para classificar e-mails automaticamente em Produtivo ou Improdutivo e sugerir respostas adequadas, ajudando equipes que recebem grande volume de mensagens a economizar tempo.

---

## Tecnologias utilizadas

**Backend**
- Python,
- Django,
- Django REST Framework
- Autenticação: JWT (djangorestframework-simplejwt)
- PyPDF2

**Frontend**
- React
- TypeScript
- TailwindCSS


**IA / API**
- Hugging Face (via API), modelo usado (ex.: moonshotai/Kimi-K2-Instruct-0905)

---

## Variáveis de ambiente

**Backend (api)**

- SECRET_KEY=chave_django_development
- HL_TOKEN=hf_...seu_token_huggingface...
- ALLOWED_HOSTS=localhost,127.0.0.1


**Frontend (ui)**

- VITE_API_HOST=http://localhost:8000

---

## Como rodar localmente

### 1.Clone o respositório
- git clone https://github.com/AlvaroSBernucci/SmartMail.git
- cd SmartMail

### 2.Backend (Django Rest)
- cd api
- pip install -r requirements.txt
- python manage.py migrate
- python manage.py runserver
  
**Criar virtualenv**
- python -m venv .venv
- source .venv/bin/activate

**Windows (PowerShell)**
- python -m venv .venv
- .\.venv\Scripts\Activate.ps1


- pip install -r requirements.txt

### Definir variáveis de ambiente (exemplo Bash)
- export SECRET_KEY="minha_secret_key_dev"
- export HL_TOKEN="hf_..."
- export ALLOWED_HOSTS="localhost"

### Migrações e superuser
- python manage.py migrate
- python manage.py createsuperuser

### Rodar servidor de desenvolvimento
- python manage.py runserver 0.0.0.0:8000

### O backend ficará disponível em http://localhost:8000.

### 3.Frontend (React + Vite)
- cd ui
- npm install
# opcional: criar .env com VITE_API_HOST=http://localhost:8000
- npm run dev

O Vite exibirá a URL (ex.: http://localhost:5173) — abra no navegador.

--- 


# Fluxo de uso (resumido)

Acesse o frontend.

(Opcional) Faça login com o superuser criado.

Cole o texto do e-mail ou faça upload de um .txt / .pdf.

Clique em Analisar — o backend irá:

Extrair e pré-processar o texto (remoção de stopwords, limpeza, stemming simples);

Montar e enviar prompt para o modelo via API (HL_TOKEN);

Receber JSON com classificação e sugestão de resposta;

Persistir e retornar o resultado ao frontend.

---

# Endpoints importantes

POST /api/token/ — obter JWT (enviar { "username": "...", "password": "..." })

GET/POST /api/v1/emails/ — criar e listar análises de e-mail (Authorization: Bearer <token>)

**Exemplo (curl — enviar texto)**
curl -X POST http://localhost:8000/api/v1/emails/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"original_text": "Olá, preciso de uma atualização sobre o meu processo."}'

**Exemplo (curl — upload de arquivo)**
curl -X POST http://localhost:8000/api/v1/emails/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "upload=true" \
  -F "file=@/caminho/para/email.txt"

---

# Como a IA está integrada (visão técnica)

Pré-processamento: limpeza do texto, remoção de pontuação, stopwords e stemming simples.

Prompt + Chamada de API: monta prompt que solicita ao modelo uma resposta JSON com campos específicos (classification, priority, ia_suggestion_text, original_text).

Validação: o backend valida se o JSON retornado contém os campos esperados antes de persistir.

Mapeamento:

classification: 1 = Produtivo, 2 = Improdutivo

priority: 1 = Alta, 2 = Média, 3 = Baixa, 0 = N/A

ia_suggestion_text: texto da resposta sugerida

# Limitações conhecidas & melhorias sugeridas

Pré-processamento atual é simples — migrar para spaCy ou NLTK melhora a qualidade.

Tratar respostas mal-formadas / timeouts da API com retry, circuit breaker e logs.

Implementar fila de processamento (Celery + RabbitMQ/Redis) para alto volume sem bloquear requests.

Adicionar testes unitários/integrados para o pipeline (NLP, integração IA, upload).

Harden de segurança (CORS, rate-limiting, não usar DEBUG=True em produção).




Developed by Álvaro de Sena Bernucci – Fullstack Developer
LinkedIn: https://www.linkedin.com/in/alvarobernucci/
