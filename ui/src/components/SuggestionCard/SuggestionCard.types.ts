export interface SuggestionCardInterface {
  id: number;
  classificationLabel: string;
  priorityLabel: string;
  classification: number;
  priority: number;
  originalText: string;
  iaSuggestionText: string;
  createDate: string;
  fetchData: (signal: AbortSignal) => Promise<void>;
}
