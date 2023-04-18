import { RangoClient } from 'rango-sdk';
import { RANGO_DAPP_API_KEY, RANGO_DAPP_API_BASE_URL } from '../constants';

// this API key is limited and
// it is only for test purpose
const RANGO_PUBLIC_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32';

export const httpService = new RangoClient(
  RANGO_DAPP_API_KEY || RANGO_PUBLIC_API_KEY,
  RANGO_DAPP_API_BASE_URL
);
