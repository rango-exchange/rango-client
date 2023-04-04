import { RangoClient } from 'rango-sdk';
import { RANGO_DAPP_API_KEY } from '../constants';

export const httpService = new RangoClient(RANGO_DAPP_API_KEY || '');
