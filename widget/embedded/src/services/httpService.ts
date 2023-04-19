import { RangoClient } from 'rango-sdk';
import { getConfig } from '../utils/configs';

// this API key is limited and
// it is only for test purpose
export const RANGO_PUBLIC_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32';

let rango: RangoClient | undefined = undefined;

export const httpService = () => {
  if (rango) return rango;
  rango = new RangoClient(getConfig('API_KEY'));
  return rango;
};
