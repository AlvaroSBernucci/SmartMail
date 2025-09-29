import { useEffect, useState } from 'react';
import { api } from '../utils/axios';
import type {
  AxiosRequestConfig,
  AxiosError as AxiosErrorInterface,
} from 'axios';
import { AxiosError } from 'axios';

function useAxios<T>(url: string, options?: AxiosRequestConfig) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosErrorInterface | null>(null);

  const fetchData = async (signal: AbortSignal) => {
    setLoading(true);
    try {
      const response = await api.get<T>(url, { ...options, signal });
      setData(response.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.code === 'ERR_CANCELED') {
          console.log('Requisição abortada');
        } else {
          setError(err);
        }
      } else if (err instanceof Error) {
        setError(new AxiosError(err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchData(signal);

    return () => {
      controller.abort();
    };
  }, [url, options]);

  return { data, loading, error, fetchData };
}

export default useAxios;
