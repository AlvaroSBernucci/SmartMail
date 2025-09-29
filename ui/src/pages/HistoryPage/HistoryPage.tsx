import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAxios from '../../hooks/useAxios';
import SuggestionCard from '../../components/SuggestionCard/SuggestionCard';
import type { EmailInterface } from './HistoryPage.types';

function HistoryPage() {
  const { data: emails, fetchData } =
    useAxios<EmailInterface[]>(`api/v1/emails/`);

  return (
    <div className="w-full grid max-w-6xl mx-auto gap-10 p-2">
      <h2 className="text-2xl font-semibold text-foreground">
        <span className="mr-2">
          <FontAwesomeIcon icon={faCalendar} />
        </span>
        Histórico de Análises
      </h2>
      <div className="flex flex-wrap gap-8 justify-center">
        {emails && emails.length ? (
          emails.map((email) => (
            <SuggestionCard
              key={email.id}
              id={email.id}
              classificationLabel={email.classification_label}
              priorityLabel={email.priority_label}
              originalText={email.original_text}
              iaSuggestionText={email.ia_suggestion_text}
              classification={email.classification}
              priority={email.priority}
              createDate={email.created_at}
              fetchData={fetchData}
            />
          ))
        ) : (
          <p>Não há emails para serem exibidos</p>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
