import { RangoClient } from 'rango-sdk';
export const httpService = new RangoClient(process.env.REACT_API_KEY as string);
