import { RangoClient } from 'rango-sdk';
import { getConfig } from '../configs';

let rango: RangoClient | undefined = undefined;

export const httpService = () => {
  if (rango) return rango;
  rango = new RangoClient(getConfig('API_KEY'), 'http://localhost:8080');
  return rango;
};
