import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { EMAIL_PRIORITY } from '../../consts/emailEnum';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  originalText: string;
  suggestionText: string;
  priorityLabel: number;
}

export default function SuggestionModal({
  isOpen,
  onClose,
  title,
  originalText,
  suggestionText,
  priorityLabel,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">
            <FontAwesomeIcon icon={faCheck} className="text-green-700 mr-2" />
            {title}
          </h2>
          <span
            className={`inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium inset-ring inset-ring-red-400/20 mr-6 ${
              priorityLabel === EMAIL_PRIORITY.PRODUCTIVE
                ? 'text-green-400'
                : 'text-yellow-400'
            }`}
          >
            {priorityLabel}
          </span>
        </div>

        <div className="mb-4 text-sm">
          <h3 className="font-medium text-left">Conteúdo Original:</h3>
          <textarea
            readOnly
            value={originalText}
            className="w-full p-2 mt-1 border rounded h-24 resize-none"
          />
        </div>

        <div className="text-sm">
          <h3 className="font-medium text-left">Resposta Sugerida:</h3>
          <textarea
            readOnly
            value={suggestionText}
            className="w-full p-2 mt-1 border rounded h-32 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
