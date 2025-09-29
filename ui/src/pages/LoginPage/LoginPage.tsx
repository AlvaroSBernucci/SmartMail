import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../../utils/axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Preencha todos os campos!');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/token/', { username, password });
      localStorage.setItem('token', response.data.access);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-xl p-8 flex flex-col gap-6"
      >
        <div className="text-center flex flex-col items-center gap-2">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-[#1a1f4b] text-5xl"
          />
          <h1 className="text-3xl font-bold text-[#1a1f4b]">AutoU Email AI</h1>
          <p className="text-gray-500 text-sm">
            Sistema de classificação de emails
          </p>
        </div>

        <div className="text-center flex items-center justify-center gap-2 text-xl text-[#1a1f4b] font-semibold">
          <FontAwesomeIcon icon={faSignInAlt} />
          Fazer Login
        </div>
        <p className="text-center text-gray-500 text-sm">
          Digite suas credenciais para acessar o sistema
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usuário
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full outline-none bg-transparent text-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full outline-none bg-transparent text-gray-800"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#1a1f4b] hover:bg-[#243064] text-white font-semibold py-2 rounded-lg transition ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
