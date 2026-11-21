import type { Asset } from 'rango-sdk';

import { useEffect, useRef } from 'react';

import { getDefaultStocksToken, getInitialTradeDirection } from '../modes';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import {
  isBlockchainExcludedInConfig,
  isTokenExcludedInConfig,
} from '../utils/configs';

import { useSwapMode } from './useSwapMode';

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
    setTradeDirection,
    tradeDirection,
  } = useQuoteStore()();
  const { swapMode } = useSwapMode();

  const appStore = useAppStore();
  const config = appStore.config;
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

  const stocksConfig = config.__UNSTABLE_OR_INTERNAL__?.stocks;
  const prevStocksTicker = useRef(stocksConfig?.ticker);

  // Initial direction comes from the config; after that it is changed only by the switch button.
  useEffect(() => {
    if (swapMode !== 'stocks' || fetchMetaStatus !== 'success') {
      return;
    }
    const direction = getInitialTradeDirection(appStore, config.from?.token);
    setTradeDirection(direction);

    // On buy, the ticker's stock is preselected as destination unless the host passed one.
    if (direction === 'buy' && !config.to?.token) {
      const defaultStocksToken = getDefaultStocksToken(appStore);
      if (defaultStocksToken) {
        setToToken({ token: defaultStocksToken, meta: { blockchains } });
      }
    }
  }, [
    swapMode,
    fetchMetaStatus,
    config?.from?.token?.symbol,
    config?.from?.token?.address,
    config?.from?.token?.blockchain,
  ]);

  /*
   * When the host changes the ticker, the current direction is kept
   * and the new ticker's stock replaces the stock on its side (destination on buy, source on sell).
   */
  useEffect(() => {
    const ticker = stocksConfig?.ticker;
    const tickerChanged = prevStocksTicker.current !== ticker;
    prevStocksTicker.current = ticker;

    if (
      !tickerChanged ||
      swapMode !== 'stocks' ||
      fetchMetaStatus !== 'success'
    ) {
      return;
    }

    const defaultStocksToken = getDefaultStocksToken(appStore);
    if (!defaultStocksToken) {
      return;
    }
    if (tradeDirection === 'sell') {
      setFromToken({ token: defaultStocksToken, meta: { blockchains } });
    } else {
      setToToken({ token: defaultStocksToken, meta: { blockchains } });
    }
  }, [stocksConfig?.ticker]);

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
