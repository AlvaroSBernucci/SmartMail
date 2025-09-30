import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { clearToken, getToken } from '../../utils/auth';
import { useEffect, useState } from 'react';

function Header() {
  const location = useLocation();
  const [logged, setLogged] = useState(false);

  const handleLogout = () => {
    clearToken();
    window.location.href = '/';
  };

  useEffect(() => {
    setLogged(getToken() ? true : false);
  }, [location]);

  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon
          icon={faEnvelope}
          className="text-2xl text-[#0a0a2a]"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">AutoU Email AI</h1>
          <span className="text-xs text-gray-500">
            Classificação Inteligente
          </span>
        </div>
      </div>

      <nav className="flex gap-3">
        <Link
          to="/history"
          className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
            location.pathname === '/history'
              ? 'bg-[#0a0a2a] text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Histórico
        </Link>
        <Link
          to="/"
          className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
            location.pathname === '/'
              ? 'bg-[#0a0a2a] text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Início
        </Link>
        {logged && (
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition cursor-pointer bg-white border border-gray-300 hover:bg-gray-100`}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
