export interface EmailInterface {
  id: number;
  original_text: string;
  ia_suggestion_text: string;
  classification: number;
  classification_label: string;
  priority: number;
  priority_label: string;
  created_at: string;
}
