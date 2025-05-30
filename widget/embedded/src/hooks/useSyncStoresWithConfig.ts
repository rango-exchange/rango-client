import type { Asset } from 'rango-sdk';

import { useEffect, useRef } from 'react';

import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import {
  isBlockchainExcludedInConfig,
  isTokenExcludedInConfig,
} from '../utils/configs';

export function useSyncStoresWithConfig() {
  const {
    setInputAmount,
    setToToken,
    setToBlockchain,
    setFromBlockchain,
    resetQuote,
    setFromToken,
    fromToken,
    toToken,
    fromBlockchain,
    toBlockchain,
  } = useQuoteStore();

  const config = useAppStore().config;
  const fetchMetaStatus = useAppStore().fetchStatus;
  const blockchains = useAppStore().blockchains();
  const { findToken } = useAppStore();

  const { setAffiliateRef, setAffiliatePercent, setAffiliateWallets } =
    useAppStore();

  const fromTokensConfig = config?.from?.tokens;
  const fromBlockchainsConfig = config?.from?.blockchains;
  const toTokensConfig = config?.to?.tokens;
  const toBlockchainsConfig = config?.to?.blockchains;
  const prevConfigFromToken = useRef<Asset | undefined>(undefined);
  const prevConfigToToken = useRef<Asset | undefined>(undefined);
  const prevConfigFromBlockchain = useRef<string | undefined>(undefined);
  const prevConfigToBlockchain = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (typeof config.amount !== 'undefined') {
      setInputAmount(config.amount.toString());
    }
  }, [config?.amount]);

  useEffect(() => {
    if (fetchMetaStatus === 'success') {
      resetQuote();
      const chain = blockchains.find(
        (chain) => chain.name === config?.from?.blockchain
      );
      const fromToken = config?.from?.token;
      const token = fromToken && findToken(fromToken);

      if (chain || (!chain && prevConfigFromBlockchain.current)) {
        setFromBlockchain(chain ?? null);
      }

      if (token) {
        setFromToken({ token, meta: { blockchains } });
      } else if (!token && prevConfigFromToken.current) {
        setFromToken({ token: null });
      }

      prevConfigFromBlockchain.current = config?.from?.blockchain;
      prevConfigFromToken.current = config?.from?.token;
    }
  }, [
    config?.from?.token?.symbol,
    config?.from?.token?.address,
    config?.from?.token?.blockchain,
    config?.from?.blockchain,
    fetchMetaStatus,
  ]);

  useEffect(() => {
    if (isTokenExcludedInConfig(fromToken, fromTokensConfig)) {
      setFromToken({ token: null });
    }

    if (isBlockchainExcludedInConfig(fromBlockchain, fromBlockchainsConfig)) {
      setFromBlockchain(null);
    }
  }, [fromTokensConfig, fromBlockchainsConfig]);

  useEffect(() => {
    if (isTokenExcludedInConfig(toToken, toTokensConfig)) {
      setFromToken({ token: null });
    }
    if (isBlockchainExcludedInConfig(toBlockchain, toBlockchainsConfig)) {
      setToBlockchain(null);
    }
  }, [toTokensConfig, toBlockchainsConfig]);

  useEffect(() => {
    if (fetchMetaStatus === 'success') {
      resetQuote();
      const chain = blockchains.find(
        (chain) => chain.name === config?.to?.blockchain
      );

      const toToken = config?.to?.token;
      const token = toToken && findToken(toToken);

      if (chain || (!chain && prevConfigToBlockchain.current)) {
        setToBlockchain(chain ?? null);
      }

      if (token) {
        setToToken({ token, meta: { blockchains } });
      } else if (!token && prevConfigToToken.current) {
        setToToken({ token: null });
      }

      prevConfigToBlockchain.current = config?.to?.blockchain;
      prevConfigToToken.current = config?.to?.token;
    }
  }, [
    config?.to?.token?.symbol,
    config?.to?.token?.address,
    config?.to?.token?.blockchain,
    config?.to?.blockchain,
    fetchMetaStatus,
  ]);

  useEffect(() => {
    setAffiliateRef(config?.affiliate?.ref ?? null);
    setAffiliatePercent(config?.affiliate?.percent ?? null);
    setAffiliateWallets(config?.affiliate?.wallets ?? null);
  }, [
    config?.affiliate?.ref,
    config?.affiliate?.percent,
    config?.affiliate?.wallets,
  ]);
}
