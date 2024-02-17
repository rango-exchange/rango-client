import type { UseFetchResult } from './useFetch';
import type { BestRouteRequest, MultiRouteResponse } from 'rango-sdk';

import { httpService } from '../services/httpService';

import { useFetch } from './useFetch';

export function useFetchAllQuotes(): UseFetchResult<
  BestRouteRequest,
  MultiRouteResponse
> {
  const { fetch, loading, cancelFetch } = useFetch<
    BestRouteRequest,
    MultiRouteResponse
  >({
    request: async (requestBody, options) =>
      await httpService().getAllRoutes(requestBody, options),
  });

  return { fetch, loading, cancelFetch };
}
