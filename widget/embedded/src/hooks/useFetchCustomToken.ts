import type { Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { useState } from 'react';

import { useAppStore } from '../store/AppStore';
import { getConfig } from '../utils/configs';

type ErrorType = {
  title: string;
  message: string;
};

interface UseFetchCustomToken {
  fetchCustomToken: ({
    blockchain,
    tokenAddress,
  }: {
    blockchain: string;
    tokenAddress: string;
  }) => Promise<Token>;
  loading: boolean;
  error?: ErrorType;
}

export function useFetchCustomToken(): UseFetchCustomToken {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<undefined | ErrorType>(undefined);
  const { findToken } = useAppStore();
  const customTokens = useAppStore().customTokens();

  function produceErrorMessage(
    type: 'duplicated' | 'not-found' | 'token-exist',
    blockchain?: string
  ) {
    switch (type) {
      case 'duplicated':
        return {
          title: i18n.t('Duplicate Token'),
          message: i18n.t(
            'The address you entered is duplicate, please enter a new address.'
          ),
        };
      case 'token-exist':
        return {
          title: i18n.t('Token Already Exists'),
          message: i18n.t(
            `There's no need to add this token again because it already exists and is supported by us.`
          ),
        };
      case 'not-found':
        return {
          title: i18n.t('Token Not Found'),
          message: i18n.t({
            id: 'Sorry, no token was found on {blockchain} blockchain with the provided address. please make sure you have entered the right token address.',
            values: {
              blockchain,
            },
          }),
        };
    }
  }

  const fetchCustomToken: UseFetchCustomToken['fetchCustomToken'] = async ({
    blockchain,
    tokenAddress,
  }) => {
    setLoading(true);
    try {
      // Check for duplicate token in customTokens
      const isDuplicate = customTokens.some(
        (token) => token.address?.toLowerCase() === tokenAddress.toLowerCase()
      );
      if (isDuplicate) {
        const errorMessage = produceErrorMessage('duplicated');
        setError(errorMessage);
        return undefined;
      }

      const res = await fetch(
        `${getConfig('BASE_URL')}/meta/token?apiKey=${getConfig(
          'API_KEY'
        )}&blockchain=${blockchain}&address=${tokenAddress}`
      );
      const contentType = res.headers.get('content-type');
      const response =
        contentType &&
        contentType.includes('application/json') &&
        (await res.json());
      if (!response || response.error) {
        const errorMessage = produceErrorMessage('not-found', blockchain);
        setError(errorMessage);
        return undefined;
      }

      // Check if token is already in the system
      const isTokenFound = findToken({
        blockchain: response.blockchain,
        address: response.address,
        symbol: response.symbol,
      });
      if (isTokenFound) {
        const errorMessage = produceErrorMessage('token-exist');
        setError(errorMessage);
        return undefined;
      }

      return response;
    } catch (error: any) {
      setError(undefined);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { fetchCustomToken, loading, error };
}
