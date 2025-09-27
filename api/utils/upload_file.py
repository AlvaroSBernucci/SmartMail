import PyPDF2

def upload_file(file):
    file_name = file.name.lower()

    if file_name.endswith('.txt'):
        try:
            text = file.read().decode("utf-8")
            return text
        except Exception as e:
            return f"error: Erro ao ler o txt: {str(e)}"
    elif file_name.endswith('.pdf'):
        try:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
        except Exception as e:
            return f"error: Erro ao ler o PDF: {str(e)}"
    else:
        return "Formato não suportado. Use .txt ou .pdf"