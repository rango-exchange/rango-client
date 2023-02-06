import { BestRouteResponse, Token, UserSettings } from 'rango-sdk';
import { useEffect, useState } from 'react';
import { httpService } from '../services/httpService';
import { useBestRouteStore } from '../store/bestRoute';
import { useSettingsStore } from '../store/settings';
import { Account } from '../store/wallets';

type BlockchainName = string;
type AccountAddress = string;

export function useBestRoute() {
  const { fromToken, toToken, inputAmount } = useBestRouteStore();
  const { slippage, customSlippage, infinitApprove } = useSettingsStore();
  const swapSettings: UserSettings = {
    slippage: slippage?.toString() || customSlippage?.toString(),
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<BestRouteResponse | null>(null);

  useEffect(() => {
    if (!!fromToken && !!toToken && !!inputAmount) {
      httpService.getBestRoute({} as any);
    }
  }, [fromToken, toToken, inputAmount]);

  return { loading, error, data };
}
