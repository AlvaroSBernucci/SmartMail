export interface ModalInterface {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  originalText: string;
  suggestionText: string;
  priorityLabel: string;
  priority: number;
}
