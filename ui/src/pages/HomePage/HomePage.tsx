import { useState } from 'react';
import EmailForm from '../../components/EmailForm/EmailForm';
import StatsCard from '../../components/StatsCard/StatsCard';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAxios from '../../hooks/useAxios';
import type { SummarizeInterface } from './HomePage.types';

const icons = {
  faEnvelope: faEnvelope,
  faArrowUp: faArrowUp,
  faTriangleExclamation: faTriangleExclamation,
};

function HomePage() {
  const [uploadFile, setUploadFile] = useState(false);

  const { data: emails, fetchData } = useAxios<SummarizeInterface[]>(
    `api/v1/emails/get-summarize`
  );

  return (
    <div className="min-h-screen bg-gradient-background">
      <main className="w-full grid max-w-6xl mx-auto gap-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Dashboard de Análises
          </h2>
          <p className="text-muted-foreground text-zinc-400">
            Acompanhe o desempenho da classificação inteligente de emails
          </p>
        </div>
        <div className="flex justify-center gap-15">
          {emails &&
            emails.map((item, index) => (
              <StatsCard
                key={index}
                title={item.title}
                value={item.value}
                icon={icons[item.icon as keyof typeof icons]}
                color={item.color}
              />
            ))}
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold text-foreground">
            <span>
              <FontAwesomeIcon icon={faDownload} />
            </span>{' '}
            Classificação de Email
          </h3>
          <p className="text-muted-foreground text-zinc-400 mt-2">
            Faça upload de um arquivo ou cole o texto do email para análise
          </p>
        </div>
        <div className="flex justify-self-center justify-between w-200 h-8">
          <button
            type="button"
            className={`cursor-pointer w-full font-semibold text-sm ${
              uploadFile ? 'opacity-50' : ''
            }`}
            onClick={() => setUploadFile(false)}
          >
            <span className="mr-2">
              <FontAwesomeIcon icon={faQuoteLeft} />
            </span>
            Texto
          </button>
          <button
            type="button"
            className={`cursor-pointer w-full font-semibold text-sm ${
              !uploadFile ? 'opacity-50' : ''
            }`}
            onClick={() => setUploadFile(true)}
          >
            <span className="mr-2">
              <FontAwesomeIcon icon={faFile} />
            </span>
            Arquivo
          </button>
        </div>
        <div>
          <EmailForm uploadFile={uploadFile} fetchData={fetchData} />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
