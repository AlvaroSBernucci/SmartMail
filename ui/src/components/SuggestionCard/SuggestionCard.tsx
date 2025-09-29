import { useState } from 'react';
import { EMAIL_PRIORITY } from '../../consts/emailEnum';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SuggestionModal from '../SuggestionModal/SuggestionModal';
import { api } from '../../utils/axios';

function SuggestionCard({
  id,
  classificationLabel,
  priorityLabel,
  priority,
  originalText,
  iaSuggestionText,
  createDate,
  fetchData,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id) => {
    try {
      const resp = await api.delete(`api/v1/emails/${id}/`);
      console.log(resp.data);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between w-72 min-h-[200px] gap-4 p-4 mb-4 border-2 rounded-lg border-zinc-400">
        <div className="flex justify-between items-center text-xs">
          <span
            className={`inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium inset-ring inset-ring-red-400/20 ${
              priority === EMAIL_PRIORITY.PRODUCTIVE
                ? 'text-green-400'
                : 'text-yellow-400'
            }`}
          >
            {classificationLabel}
          </span>
          <p>{priorityLabel}</p>
        </div>

        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-left line-clamp-5">{originalText}</p>
        </div>
        <div className="">
          <p className="text-xs text-zinc-500 text-left line-clamp-5">
            {createDate}
          </p>
        </div>

        <div className="flex gap-4 items-center justify-between">
          <button
            className="text-xs flex items-center font-semibold cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            Ver Sugestão
          </button>
          <button
            className="w-6 h-6 text-red-600 cursor-pointer"
            onClick={() => handleDelete(id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      <SuggestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Análise do Email"
        originalText={originalText}
        suggestionText={iaSuggestionText || ''}
        priorityLabel={priorityLabel}
      />
    </>
  );
}

export default SuggestionCard;
