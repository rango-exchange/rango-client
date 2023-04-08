import { RangoClient } from 'rango-sdk';
import { RANGO_DAPP_API_KEY, RANGO_DAPP_BASE_URL } from '../constants';

export const httpService = new RangoClient(
  RANGO_DAPP_API_KEY || '',
  RANGO_DAPP_BASE_URL
);
