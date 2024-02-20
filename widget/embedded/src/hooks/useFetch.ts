import type { RequestOptions } from 'rango-sdk';

import { useRef, useState } from 'react';

type UseFetchOptions<TRequest, TResponse> = {
  request: (
    requestBody: TRequest,
    options?: RequestOptions
  ) => Promise<TResponse>;
};
export type UseFetchResult<TRequest, TResponse> = {
  fetch: (requestBody: TRequest) => Promise<TResponse>;
  cancelFetch: () => void;
  loading: boolean;
};

export function useFetch<TRequest, TResponse>({
  request,
}: UseFetchOptions<TRequest, TResponse>): UseFetchResult<TRequest, TResponse> {
  const [loading, setLoading] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const cancelFetch = () => abortController.current?.abort();

  const fetch: UseFetchResult<TRequest, TResponse>['fetch'] = async (
    requestBody
  ) => {
    cancelFetch();
    abortController.current = new AbortController();

    setLoading(true);
    try {
      const res = await request(requestBody, {
        signal: abortController.current.signal,
      });

      abortController.current = null;
      return res;
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetch, loading, cancelFetch };
}
