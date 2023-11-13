import type { WidgetConfig } from '../types';
import type { Asset } from 'rango-sdk';

import { useEffect, useMemo, useRef } from 'react';

import { useMetaStore } from '../store/meta';
import { useQuoteStore } from '../store/quote';
import { useSettingsStore } from '../store/settings';
import { tokensAreEqual } from '../utils/wallets';

export function useSyncStoresWithConfig(config: WidgetConfig | undefined) {
  const {
    setInputAmount,
    setToToken,
    setToBlockchain,
    setFromBlockchain,
    setFromToken,
    fromToken,
    toToken,
    fromBlockchain,
    toBlockchain,
  } = useQuoteStore();

  const {
    meta: { tokens, blockchains },
    loadingStatus: loadingMetaStatus,
  } = useMetaStore();

  const { setAffiliateRef, setAffiliatePercent, setAffiliateWallets } =
    useSettingsStore();

  const fromTokensConfig = useMemo(
    () => config?.from?.tokens,
    [config?.from?.tokens]
  );
  const fromBlockchainsConfig = useMemo(
    () => config?.from?.blockchains,
    [config?.from?.blockchains]
  );
  const toTokensConfig = useMemo(
    () => config?.to?.tokens,
    [config?.to?.tokens]
  );
  const toBlockchainsConfig = useMemo(
    () => config?.to?.blockchains,
    [config?.to?.blockchains]
  );
  const prevConfigFromToken = useRef<Asset | undefined>(undefined);
  const prevConfigToToken = useRef<Asset | undefined>(undefined);
  const prevConfigFromBlockchain = useRef<string | undefined>(undefined);
  const prevConfigToBlockchain = useRef<string | undefined>(undefined);

  useEffect(() => {
    setInputAmount(config?.amount?.toString() || '');
  }, [config?.amount]);

  useEffect(() => {
    if (loadingMetaStatus === 'success') {
      const chain = blockchains.find(
        (chain) => chain.name === config?.from?.blockchain
      );
      const token = tokens.find((t) =>
        tokensAreEqual(t, config?.from?.token || null)
      );

      if (chain || (!chain && prevConfigFromBlockchain.current)) {
        setFromBlockchain(chain ?? null);
      }

      if (token || (!token && prevConfigFromToken.current)) {
        setFromToken(token ?? null);
      }

      prevConfigFromBlockchain.current = config?.from?.blockchain;
      prevConfigFromToken.current = config?.from?.token;
    }
  }, [
    config?.from?.token?.symbol,
    config?.from?.token?.address,
    config?.from?.token?.blockchain,
    config?.from?.blockchain,
    loadingMetaStatus,
  ]);

  useEffect(() => {
    if (fromToken && fromTokensConfig) {
      if (!fromTokensConfig.some((token) => tokensAreEqual(token, fromToken))) {
        setFromToken(null);
      }
    }

    if (fromBlockchain && fromBlockchainsConfig) {
      if (!fromBlockchainsConfig.includes(fromBlockchain.name)) {
        setFromBlockchain(null);
      }
    }
  }, [fromTokensConfig, fromBlockchainsConfig]);

  useEffect(() => {
    if (toToken && toTokensConfig) {
      if (!toTokensConfig.some((token) => tokensAreEqual(token, toToken))) {
        setToToken(null);
      }
    }

    if (toBlockchain && toBlockchainsConfig) {
      if (!toBlockchainsConfig.includes(toBlockchain.name)) {
        setToBlockchain(null);
      }
    }
  }, [toTokensConfig, toBlockchainsConfig]);

  useEffect(() => {
    if (loadingMetaStatus === 'success') {
      const chain = blockchains.find(
        (chain) => chain.name === config?.to?.blockchain
      );
      const token = tokens.find((t) =>
        tokensAreEqual(t, config?.to?.token || null)
      );

      if (chain || (!chain && prevConfigToBlockchain.current)) {
        setToBlockchain(chain ?? null);
      }

      if (token || (!token && prevConfigToToken.current)) {
        setToToken(token ?? null);
      }

      prevConfigToBlockchain.current = config?.to?.blockchain;
      prevConfigToToken.current = config?.to?.token;
    }
  }, [
    config?.to?.token?.symbol,
    config?.to?.token?.address,
    config?.to?.token?.blockchain,
    config?.to?.blockchain,
    loadingMetaStatus,
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
