import { RangoClient } from 'rango-sdk';
console.log(process.env.REACT_API_KEY);
export const httpService = new RangoClient(process.env.REACT_API_KEY as string);
