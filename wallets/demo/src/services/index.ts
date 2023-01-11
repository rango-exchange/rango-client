import { API_KEY, API_URL } from "../constant";

export const getBlockchains = () =>
  fetch(`${API_URL}/meta/compact?apiKey=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => data.blockchains);
