import {TOKEN } from "./constants.mjs";

// Reusable function to handle fetch requests with authorization headers
export const fetchDataWithAuthorization = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {    
    throw new CrowdinError(`Failed to fetch data from ${url}. Status: ${response.status}`);
  }

  return await response.json();
};
