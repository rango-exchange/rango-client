import { useEffect, useRef } from 'react';
import {
  useInRouterContext,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

import { SearchParams } from '../../constants/searchParams';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';

import {
  convertTokenSearchParamToAsset,
  tokenToSearchParam,
} from './useSyncUrlAndStore.helpers';

export function useSyncUrlAndStore() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    fromBlockchain,
    toBlockchain,
    fromToken,
    toToken,
    inputAmount,
    setFromBlockchain,
    setToBlockchain,
    setFromToken,
    setToToken,
    setInputAmount,
  } = useQuoteStore();
  const fetchMetaStatus = useAppStore().fetchStatus;
  const blockchains = useAppStore().blockchains();
  const isInRouterContext = useInRouterContext();
  const { updateIframe, updateCampaignMode } = useAppStore();
  const campaignMode = useAppStore().isInCampaignMode();
  const liquiditySourcesParamsRef = useRef<string>();
  const { findToken } = useAppStore();
  const getUrlSearchParams = () => {
    const utmQueryParams: Record<string, string> = {};

    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('utm_')) {
        utmQueryParams[key] = value;
      }
    }
    const fromAmount = searchParams.get(SearchParams.FROM_AMOUNT);
    const fromBlockchain = searchParams.get(SearchParams.FROM_BLOCKCHAIN);
    const fromToken = searchParams.get(SearchParams.FROM_TOKEN);
    const toBlockchain = searchParams.get(SearchParams.TO_BLOCKCHAIN);
    const toToken = searchParams.get(SearchParams.TO_TOKEN);
    const autoConnect = searchParams.get(SearchParams.AUTO_CONNECT);
    const clientUrl = searchParams.get(SearchParams.CLIENT_URL);
    const liquiditySources = searchParams.get(SearchParams.LIQUIDITY_SOURCES);

    const blockchain = searchParams.get(SearchParams.BLOCKCHAIN);

    return {
      fromAmount,
      fromBlockchain,
      fromToken,
      toBlockchain,
      toToken,
      autoConnect,
      clientUrl,
      liquiditySources,
      utmQueryParams,
      blockchain,
    };
  };

  const updateUrlSearchParams = (
    searchParams: Record<string, string | undefined>
  ) => {
    for (const property in searchParams) {
      if (!searchParams[property]) {
        delete searchParams[property];
      }
    }
    setSearchParams(searchParams as Record<string, string>, { replace: true });
  };

  useEffect(() => {
    const { autoConnect, clientUrl, utmQueryParams, blockchain } =
      getUrlSearchParams();

    if (isInRouterContext && fetchMetaStatus === 'success') {
      updateUrlSearchParams({
        [SearchParams.FROM_BLOCKCHAIN]: fromBlockchain?.name,
        [SearchParams.FROM_TOKEN]: tokenToSearchParam(fromToken),
        [SearchParams.TO_BLOCKCHAIN]: toBlockchain?.name,
        [SearchParams.TO_TOKEN]: tokenToSearchParam(toToken),
        [SearchParams.FROM_AMOUNT]: inputAmount,
        [SearchParams.AUTO_CONNECT]: autoConnect ?? undefined,
        [SearchParams.CLIENT_URL]: clientUrl ?? undefined,
        [SearchParams.BLOCKCHAIN]: blockchain ?? undefined,
        [SearchParams.LIQUIDITY_SOURCES]: campaignMode
          ? liquiditySourcesParamsRef.current
          : undefined,
        ...utmQueryParams,
      });
    }
  }, [
    location.pathname,
    inputAmount,
    fromBlockchain,
    fromToken,
    toBlockchain,
    toToken,
    campaignMode,
    fetchMetaStatus,
  ]);

  useEffect(() => {
    if (!isInRouterContext) {
      return;
    }

    const searchParams = getUrlSearchParams();

    if (!liquiditySourcesParamsRef.current && searchParams.liquiditySources) {
      liquiditySourcesParamsRef.current = searchParams.liquiditySources;
    }

    if (searchParams.fromAmount) {
      setInputAmount(searchParams.fromAmount);
    }

    if (fetchMetaStatus === 'success') {
      const fromBlockchain = blockchains.find(
        (blockchain) => blockchain.name === searchParams.fromBlockchain
      );

      const fromToken =
        searchParams.fromToken && fromBlockchain
          ? findToken(
              convertTokenSearchParamToAsset(
                searchParams.fromToken,
                fromBlockchain
              )
            )
          : undefined;
      const toBlockchain = blockchains.find(
        (blockchain) => blockchain.name === searchParams.toBlockchain
      );

      const toToken =
        searchParams.toToken && toBlockchain
          ? findToken(
              convertTokenSearchParamToAsset(searchParams.toToken, toBlockchain)
            )
          : undefined;

      if (!!fromBlockchain) {
        setFromBlockchain(fromBlockchain);
        if (!!fromToken) {
          setFromToken({
            token: fromToken,
            meta: {
              blockchains: blockchains,
            },
          });
        }
      }

      if (!!toBlockchain) {
        setToBlockchain(toBlockchain);
        if (!!toToken) {
          setToToken({
            token: toToken,
            meta: { blockchains: blockchains },
          });
        }
      }
    }
  }, [fetchMetaStatus]);

  useEffect(() => {
    const { clientUrl, liquiditySources } = getUrlSearchParams();
    // We run this only once, because if the app is embedded into an iframe, the data in url for iframe will not change.
    updateIframe('clientUrl', clientUrl || undefined);

    updateCampaignMode(
      'liquiditySources',
      liquiditySources?.split(',') ?? undefined
    );
  }, []);
}
