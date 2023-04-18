import { RangoClient } from 'rango-sdk';

// this API key is limited and
// it is only for test purpose
const RANGO_PUBLIC_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32';

export const rango = new RangoClient(
  (process.env.REACT_APP_API_KEY as string) || RANGO_PUBLIC_API_KEY,
);
