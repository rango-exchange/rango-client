import { RangoClient } from 'rango-sdk';
export const rango = new RangoClient(process.env.REACT_APP_API_KEY as string);
