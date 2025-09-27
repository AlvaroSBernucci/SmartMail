import React, { useState } from 'react';
import { api } from '../../utils/axios';

function EmailForm() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log(email);
  //   console.log(file);
  //   try {
  //     const resp = await api.post(`api/v1/emails/`, {
  //       original_text: email,
  //       file: file,
  //       upload: true,
  //     });
  //     console.log(resp.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificações básicas:
    if (!email && !file) {
      alert('Você precisa preencher o texto OU enviar um arquivo.');
      return;
    }

    const formData = new FormData();

    // Se o usuário digitou texto, adicionamos ele
    if (email) {
      formData.append('original_text', email);
    }

    // Se o usuário fez upload, adicionamos o arquivo
    if (file) {
      formData.append('file', file);
      formData.append('upload', 'true'); // apenas para o backend saber que veio arquivo
    }

    try {
      const resp = await api.post(`api/v1/emails/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <textarea
          name="email"
          rows={5}
          cols={40}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Coloque o conteúdo do email que deseja classificar"
        ></textarea>
      </div>
      <div>
        <input type="file" accept=".txt, .pdf" onChange={handleFileChange} />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
}

export default EmailForm;
