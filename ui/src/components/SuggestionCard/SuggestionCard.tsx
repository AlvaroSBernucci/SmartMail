import { useState } from 'react';
import { EMAIL_CLASSIFICATION, EMAIL_PRIORITY } from '../../consts/emailEnum';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SuggestionModal from '../SuggestionModal/SuggestionModal';
import { api } from '../../utils/axios';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import type { SuggestionCardInterface } from './SuggestionCard.types';

function SuggestionCard({
  id,
  classificationLabel,
  priorityLabel,
  classification,
  priority,
  originalText,
  iaSuggestionText,
  createDate,
  fetchData,
}: SuggestionCardInterface) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: number) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta sugestão? Essa ação não poderá ser desfeita.'
    );
    if (!confirmed) return;

    try {
      await api.delete(`api/v1/emails/${id}/`);
      toast.success('Email deletado com sucesso!');
      fetchData(signal);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err?.response?.request.response) {
          toast.error(
            `Não foi possível deletar: ${err.response.request.response}`
          );
        } else {
          toast.error('Não foi possível deletar o email');
        }
      }
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between w-85 min-h-[250px] gap-4 p-4 mb-4 border-2 rounded-lg border-zinc-400">
        <div className="flex justify-between items-center text-xs">
          <span
            className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium inset-ring  ${
              classification === EMAIL_CLASSIFICATION.PRODUCTIVE
                ? 'text-green-400 bg-green-400/10 inset-ring-green-500'
                : 'text-yellow-400 bg-yellow-400/10 inset-ring-yellow-400'
            }`}
          >
            {classificationLabel}
          </span>
          <p className="text-xs text-zinc-500">
            <span>
              {priority === EMAIL_PRIORITY.HIGHT ? (
                <FontAwesomeIcon icon={faArrowUp} className="text-green-700" />
              ) : priority === EMAIL_PRIORITY.MEDIUM ? (
                <FontAwesomeIcon icon={faMinus} className="text-yellow-500" />
              ) : (
                <FontAwesomeIcon icon={faArrowDown} className="text-red-700" />
              )}
            </span>{' '}
            {priorityLabel}
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-left line-clamp-5">{originalText}</p>
        </div>
        <hr className="text-zinc-400"></hr>
        <div>
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
        priority={priority}
      />
    </>
  );
}

export default SuggestionCard;
