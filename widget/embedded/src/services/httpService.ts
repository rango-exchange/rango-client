import { RangoClient } from 'rango-sdk';

import { getConfig } from '../utils/configs';

let rango: RangoClient | undefined = undefined;

export const httpService = () => {
  if (rango) {
    return rango;
  }
  rango = new RangoClient(getConfig('API_KEY'), getConfig('BASE_URL'));
  return rango;
};
