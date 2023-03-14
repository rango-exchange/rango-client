export const RANGO_DAPP_ID_QUERY = process.env.REACT_APP_RANGO_DAPP_ID_QUERY;
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const RANGO_COOKIE_HEADER = 'X-Rango-Id';

export const ERROR_MESSAGE_DEPENDS_ON_OTHER_QUEUES =
  'Waiting for other running tasks to be finished';
export const ERROR_MESSAGE_WAIT_FOR_WALLET = 'Waiting for connecting wallet';
export const ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION_WRONG_WALLET = (
  type: string | null,
  address: string | null
): string =>
  `Please change your ${type || 'wallet'} account to ${
    address || 'proper address'
  }`;
export const ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION = (
  type: string | null
): string =>
  `Please connect to ${
    type || 'your wallet'
  } by using bellow button or top right button on page.`;
export const ERROR_MESSAGE_WAIT_FOR_CHANGE_NETWORK = (
  network: string | null
): string => `Please change your network to ${network}.`;
