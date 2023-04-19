import { RangoClient } from 'rango-sdk';
import { getConfig } from '../configs';

let rangoClient: RangoClient | undefined = undefined;

export const rango = () => {
  if (rangoClient) return rangoClient;
  rangoClient = new RangoClient(getConfig('API_KEY'));
  return rangoClient;
};
