import type { Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { useState } from 'react';

import { useAppStore } from '../store/AppStore';
import { getConfig } from '../utils/configs';

type ErrorType = {
  title: string;
  message: string;
  type: 'TOKEN_ERROR' | 'NETWORK_ERROR';
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
  const { findToken, customTokens } = useAppStore();

  const handleTokenIsDuplicateError = () => {
    setError({
      title: i18n.t('Duplicate Token'),
      message: i18n.t(
        'The address you entered is duplicate, please enter a new address.'
      ),
      type: 'TOKEN_ERROR',
    });
  };

  const handleTokenNotFoundError = (blockchain: string) => {
    setError({
      title: i18n.t('Token Not Found'),
      message: i18n.t(
        `Sorry, no token was found on ${blockchain} blockchain with the provided address. please make sure you have entered the right token address.`
      ),
      type: 'TOKEN_ERROR',
    });
  };

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
        handleTokenIsDuplicateError();
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
        handleTokenNotFoundError(blockchain);
        return undefined;
      }

      // Check if token is already in the system
      const isTokenFound = findToken({
        blockchain: response.blockchain,
        address: tokenAddress,
        symbol: response.symbol,
      });
      if (isTokenFound) {
        handleTokenIsDuplicateError();
        return undefined;
      }

      return response;
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        setError({
          title: i18n.t('Network Error'),
          message: i18n.t('Failed Network, Please retry.'),
          type: 'NETWORK_ERROR',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return { fetchCustomToken, loading, error };
}
