import React, { useState } from 'react';
import { api } from '../../utils/axios';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import type { EmailFormInterface } from './EmailForm.types';

function EmailForm({ uploadFile, fetchData }: EmailFormInterface) {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!email && !file) {
      alert('Você precisa preencher o texto OU enviar um arquivo.');
      setLoading(false);
      return;
    }

    const formData = new FormData();

    if (email) {
      formData.append('original_text', email);
    }

    if (file) {
      formData.append('file', file);
      formData.append('upload', 'true');
    }

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      await api.post(`api/v1/emails/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchData(signal);
      navigate('/history');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setEmail('');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="email-form grid justify-center">
      {!uploadFile ? (
        <textarea
          name="email"
          className="p-3 border-2 rounded-lg border-zinc-400 focus:rounded-lg w-200 h-48"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Coloque o conteúdo do email que deseja classificar"
        ></textarea>
      ) : (
        <div className="p-3 border-2 rounded-lg border-zinc-400 w-200 h-48">
          <input
            type="file"
            id="file-upload"
            accept=".txt, .pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center w-full h-full cursor-pointer text-zinc-500"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            {file
              ? file.name
              : 'Clique para selecionar o arquivo (fomato .txt ou .pdf)'}
          </label>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`w-full p-3 text-sm bg-gray-400 text-white rounded-lg mt-2
    ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
  `}
      >
        {loading ? 'Carregando...' : 'Analisar Email'}
      </button>
    </form>
  );
}

export default EmailForm;
