import type { UseFetchResult } from './useFetch';
import type { ConfirmRouteRequest, ConfirmRouteResponse } from 'rango-sdk';

import { httpService } from '../services/httpService';

import { useFetch } from './useFetch';

export function useFetchConfirmQuote(): UseFetchResult<
  ConfirmRouteRequest,
  ConfirmRouteResponse
> {
  const { fetch, loading, cancelFetch } = useFetch<
    ConfirmRouteRequest,
    ConfirmRouteResponse
  >({
    request: async (requestBody, options) =>
      await httpService().confirmRouteRequest(requestBody, options),
  });

  return { fetch, loading, cancelFetch };
}
