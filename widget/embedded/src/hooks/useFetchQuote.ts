import type { BestRouteRequest, BestRouteResponse } from 'rango-sdk';

import { useRef, useState } from 'react';

import { httpService } from '../services/httpService';

interface UseFetchQuote {
  fetch: (requestBody: BestRouteRequest) => Promise<BestRouteResponse>;
  cancelFetch: () => void;
  loading: boolean;
}

export function useFetchQuote(): UseFetchQuote {
  const [loading, setLoading] = useState(false);
  const abortController = useRef<AbortController | null>(null);
  const cancel = () => abortController.current?.abort();

  const fetch: UseFetchQuote['fetch'] = async (requestBody) => {
    cancel();
    abortController.current = new AbortController();

    setLoading(true);

    try {
      const res = await httpService().getBestRoute(requestBody, {
        signal: abortController.current.signal,
      });
      abortController.current = null;
      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-useless-catch
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return { fetch, loading, cancelFetch: cancel };
}
