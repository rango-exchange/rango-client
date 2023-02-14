import { BestRouteType } from '@rangodev/ui/dist/types/swaps';
import { BestRouteRequest, BestRouteResponse, Token, UserSettings } from 'rango-sdk';
import { useEffect, useRef, useState } from 'react';
import { httpService } from '../services/httpService';
import { useBestRouteStore } from '../store/bestRoute';
import { useSettingsStore } from '../store/settings';

export function useBestRoute() {
  const { fromToken, toToken, inputAmount } = useBestRouteStore();
  const { slippage, customSlippage, infinitApprove } = useSettingsStore();
  const swapSettings: UserSettings = {
    slippage: customSlippage?.toString() || slippage.toString(),
  };
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<BestRouteResponse | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const retry = () => {
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    if (!!fromToken && !!toToken && !!inputAmount) {
      if (!!data) setData(null);
      const requestBody: BestRouteRequest = {
        amount: inputAmount?.toString(),
        connectedWallets: [],
        selectedWallets: {},
        checkPrerequisites: false,
        from: {
          address: fromToken.address,
          blockchain: fromToken.blockchain,
          symbol: fromToken.symbol,
        },
        to: { address: toToken.address, blockchain: toToken.blockchain, symbol: toToken.symbol },
      };
      setLoading(true);
      httpService
        .getBestRoute(requestBody, { signal: abortControllerRef.current.signal })
        .then((res) => {
          setData(res);
          setLoading(false);
          abortControllerRef.current = null;
        })
        .catch((error) => {
          if (error.code === 'ERR_CANCELED') return;
          setError(error.message);
          setLoading(false);
        });
    }
  }, [fromToken, toToken, inputAmount, count]);

  return { loading, error, data, retry };
}
