import type { TokenData } from '../components/TokenList/TokenList.types';
import type { Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { useState } from 'react';

import { httpService } from '../services/httpService';
import { useAppStore } from '../store/AppStore';

type ErrorType = 'duplicated' | 'not-found' | 'token-exist' | 'network-error';

export type CustomTokenError = {
  type: ErrorType;
  title: string;
  message: string;
};

export interface UseFetchCustomToken {
  fetchCustomToken: ({
    blockchain,
    tokenAddress,
  }: {
    blockchain: string;
    tokenAddress: string;
  }) => Promise<void>;
  token: Token | null;
  loading: boolean;
  error: CustomTokenError | null;
  resetState: () => void;
}

export function useFetchCustomToken(): UseFetchCustomToken {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CustomTokenError | null>(null);
  const [token, setToken] = useState<TokenData | null>(null);
  const { findToken } = useAppStore();
  const customTokens = useAppStore().customTokens();

  const resetState = () => {
    setToken(null);
    setLoading(false);
    setError(null);
  };

  function produceErrorMessage(
    type: ErrorType,
    blockchain?: string
  ): CustomTokenError {
    switch (type) {
      case 'duplicated':
        return {
          type,
          title: i18n.t('Duplicate Token'),
          message: i18n.t(
            'The address you entered is duplicate, please enter a new address.'
          ),
        };
      case 'token-exist':
        return {
          type,
          title: i18n.t('Token Already Exists'),
          message: i18n.t(
            `There's no need to add this token again because it already exists and is supported by us.`
          ),
        };
      case 'not-found':
        return {
          type,
          title: i18n.t('Token Not Found'),
          message: i18n.t({
            id: 'Sorry, no token was found on {blockchain} chain with the provided address. please make sure you have entered the right token address.',
            values: {
              blockchain,
            },
          }),
        };
      case 'network-error':
        return {
          type,
          title: i18n.t('Network error'),
          message: i18n.t('An error occurred while retrieving token data.'),
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
        return;
      }

      const response = await httpService().getCustomToken({
        blockchain,
        address: tokenAddress,
      });

      if (!response || !response.token || response.error) {
        const errorMessage = produceErrorMessage('not-found', blockchain);
        setError(errorMessage);
        return;
      }

      // Check if token is already in the system
      const token = response.token;
      const isTokenFound = findToken({
        blockchain: token.blockchain,
        address: token.address,
        symbol: token.symbol,
      });
      if (isTokenFound) {
        const errorMessage = produceErrorMessage('token-exist');
        setError(errorMessage);
        return;
      }

      return setToken({ ...token, warning: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 'ERR_BAD_REQUEST') {
        const errorMessage = produceErrorMessage('not-found', blockchain);
        setError(errorMessage);
        return;
      }
      setError(produceErrorMessage('network-error'));
      return;
    } finally {
      setLoading(false);
    }
  };
  return { fetchCustomToken, token, loading, error, resetState };
}
