export interface EmailFormInterface {
  uploadFile: boolean;
  fetchData: (signal: AbortSignal) => Promise<void>;
}
