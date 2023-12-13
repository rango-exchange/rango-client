import type { Asset } from 'rango-sdk';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { tokensAreEqual } from '../utils/wallets';

export function useSyncStoresWithConfig() {
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

  const config = useAppStore().config;
  const fetchMetaStatus = useAppStore().fetchStatus;
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();

  const { setAffiliateRef, setAffiliatePercent, setAffiliateWallets } =
    useAppStore();

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

  /*
   * We update quote tokens in two scenarios.
   * If default values exist in widget config or search parameters exist in URL.
   * The logic for updating quote store exists in two useEffect in two locations, and they run in order.If default tokens for quote exist in widget config and also exist in URL, widget config values take precedence over URL values, and URL search parameters don’t affect the widget.
   * Using useLayoutEffect causes widget config values to apply first.
   * We may consider replacing this with a better solution in the future.
   */
  useLayoutEffect(() => {
    if (fetchMetaStatus === 'success') {
      const chain = blockchains.find(
        (chain) => chain.name === config?.from?.blockchain
      );
      const token = tokens.find((t) =>
        tokensAreEqual(t, config?.from?.token || null)
      );

      if (chain || (!chain && prevConfigFromBlockchain.current)) {
        setFromBlockchain(chain ?? null);
      }

      if (token) {
        setFromToken({ token, meta: { blockchains, tokens } });
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
    if (fromToken && fromTokensConfig) {
      if (!fromTokensConfig.some((token) => tokensAreEqual(token, fromToken))) {
        setFromToken({ token: null });
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
        setToToken({ token: null });
      }
    }

    if (toBlockchain && toBlockchainsConfig) {
      if (!toBlockchainsConfig.includes(toBlockchain.name)) {
        setToBlockchain(null);
      }
    }
  }, [toTokensConfig, toBlockchainsConfig]);

  /*
   * We update quote tokens in two scenarios.
   * If default values exist in widget config or search parameters exist in URL.
   * The logic for updating quote store exists in two useEffect in two locations, and they run in order.If default tokens for quote exist in widget config and also exist in URL, widget config values take precedence over URL values, and URL search parameters don’t affect the widget.
   * Using useLayoutEffect causes widget config values to apply first.
   * We may consider replacing this with a better solution in the future.
   */
  useLayoutEffect(() => {
    if (fetchMetaStatus === 'success') {
      const chain = blockchains.find(
        (chain) => chain.name === config?.to?.blockchain
      );
      const token = tokens.find((t) =>
        tokensAreEqual(t, config?.to?.token || null)
      );

      if (chain || (!chain && prevConfigToBlockchain.current)) {
        setToBlockchain(chain ?? null);
      }

      if (token) {
        setToToken({ token, meta: { blockchains, tokens } });
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
