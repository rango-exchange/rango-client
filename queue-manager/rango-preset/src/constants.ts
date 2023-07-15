export const ERROR_MESSAGE_DEPENDS_ON_OTHER_QUEUES =
  'Waiting for other swaps to complete';
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

export const DEFAULT_ERROR_CODE = 'CLIENT_UNEXPECTED_BEHAVIOUR';
