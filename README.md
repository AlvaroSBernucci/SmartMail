# SmartMail — AutoU Case Study
SmartMail is a web application that uses AI to automatically classify emails as Productive or Non-Productive and suggest appropriate responses, helping teams that receive a high volume of messages save time.

## Technologies Used
### Backend
- Python
- Django
- Django REST Framework
- Authentication: JWT (djangorestframework-simplejwt)
- PyPDF2

### Frontend
- React
- TypeScript
- TailwindCSS

### AI / API
- Hugging Face (via API), model used (e.g., moonshotai/Kimi-K2-Instruct-0905)

---

## Environment Variables
### Backend (api)
- SECRET_KEY=django_development_key
- HL_TOKEN=hf_...your_huggingface_token...
- ALLOWED_HOSTS=localhost,127.0.0.1

### Frontend (ui)
- VITE_API_HOST=http://localhost:8000

---

## How to Run Locally
### 1. Clone the Repository
- git clone https://github.com/AlvaroSBernucci/SmartMail.git
- cd SmartMail

### 2. Backend (Django REST)
- cd api
- pip install -r requirements.txt
- python manage.py migrate
- python manage.py runserver

**Create Virtual Environment**
- python -m venv .venv
- source .venv/bin/activate

**Windows (PowerShell)**
- python -m venv .venv
- .\.venv\Scripts\Activate.ps1

- pip install -r requirements.txt

**Set Environment Variables**
- export SECRET_KEY="my_dev_secret_key"
- export HL_TOKEN="hf_..."
- export ALLOWED_HOSTS="localhost"

**Migrations and Superuser**
- python manage.py migrate
- python manage.py createsuperuser

**Run Development Server**
- python manage.py runserver 0.0.0.0:8000

The backend will be available at http://localhost:8000.

### 3. Frontend (React + Vite)
- cd ui
- npm install
***Optional: create .env with VITE_API_HOST=http://localhost:8000***
- npm run dev

Vite will display the URL (e.g., http://localhost:5173) — open it in your browser.

---

## Deployed link
https://smartmail-frontend.onrender.com/login

**username: admin**
**password: admin**

---

## Usage Flow (Summary)
Access the frontend.
(Optional) Log in with the created superuser.
Paste the email text or upload a .txt / .pdf file.
Click Analyze — the backend will:

Extract and preprocess the text (removing stopwords, cleaning, simple stemming);
Build and send a prompt to the model via API (HL_TOKEN);
Receive a JSON response with classification and response suggestion;
Persist and return the result to the frontend.

### Key Endpoints
- POST /api/token/ (obtain JWT token)
- GET/POST /api/v1/emails/ (create and list email analyses)

### Example (curl — send text)
curl -X POST http://localhost:8000/api/v1/emails/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"original_text": "Hello, I need an update on my process."}'
  
### Example (curl — file upload)
curl -X POST http://localhost:8000/api/v1/emails/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "upload=true" \
  -F "file=@/path/to/email.txt"

---

## How AI is Integrated (Technical Overview)

Preprocessing: Text cleaning, removal of punctuation, stopwords, and simple stemming.
Prompt + API Call: Constructs a prompt that requests the model to return a JSON response with specific fields (classification, priority, ia_suggestion_text, original_text).
Validation: The backend validates that the returned JSON contains the expected fields before persisting.

Mapping:
classification: 1 = Productive, 2 = Non-Productive
priority: 1 = High, 2 = Medium, 3 = Low, 0 = N/A
ia_suggestion_text: Suggested response text

---

## Known Limitations & Suggested Improvements

- Current preprocessing is basic — migrating to spaCy or NLTK would improve quality.
- Implement a processing queue (Celery + RabbitMQ/Redis) for high volume without blocking requests.
- Add unit/integration tests for the pipeline (NLP, AI integration, uploads).

---

Developed by **Álvaro de Sena Bernucci – Fullstack Developer**

LinkedIn: https://www.linkedin.com/in/alvarobernucci/

---
