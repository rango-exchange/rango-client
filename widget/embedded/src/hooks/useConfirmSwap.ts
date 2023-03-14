import {
  BestRouteType,
  SimulationValidationStatus,
} from '@rango-dev/ui/dist/types/swaps';
// import { WalletType } from '@rango-dev/wallets-shared';
import BigNumber from 'bignumber.js';
import { BestRouteRequest, BestRouteResponse } from 'rango-sdk';
import { useState } from 'react';
import { httpService } from '../services/httpService';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { useWalletsStore } from '../store/wallets';
import { compareRoutes, getRequiredBalanceOfWallet } from '../utils/routing';
import { SelectedWallet } from '../utils/wallets';

type CheckFeeAndBalanceResult =
  | {
      hasEnoughBalanceOrSlippage: {
        balance: boolean;
        slippage: boolean;
        routeChanged: boolean;
      };
      bestRoute: BestRouteType;
    }
  | { bestRoute: null }
  | null;

export function useConfirmSwap() {
  const fromToken = useBestRouteStore.use.fromToken();
  const toToken = useBestRouteStore.use.toToken();
  const inputAmount = useBestRouteStore.use.inputAmount();
  const bestRoute = useBestRouteStore.use.bestRoute();
  const setBestRoute = useBestRouteStore.use.setBestRoute();
  const accounts = useWalletsStore.use.accounts();
  const selectedWallets = useWalletsStore.use.selectedWallets();
  const tokens = useMetaStore.use.meta().tokens;

  const slippage = useSettingsStore.use.slippage();
  const disabledLiquiditySources =
    useSettingsStore.use.disabledLiquiditySources();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [data, setData] = useState<BestRouteResponse | null>(null);
  const [feeStatus, setFeeStatus] = useState<
    SimulationValidationStatus[] | null
  >(null);
  const [bestRouteChanged, setBestRouteChanged] = useState(false);
  const [enoughBalance, setEnoughBalance] = useState<boolean | null>(null);

  const hasEnoughBalanceOrProperSlippage = (
    route: BestRouteType,
    selectedWallets: SelectedWallet[],
    userSlippage: string,
    routeChanged: boolean
  ): { balance: boolean; slippage: boolean; routeChanged: boolean } => {
    const fee = route.validationStatus;

    if (fee === null || fee.length === 0)
      return { balance: true, slippage: true, routeChanged };

    for (const wallet of selectedWallets) {
      const requiredAssets = getRequiredBalanceOfWallet(wallet, fee);
      if (!requiredAssets) continue;

      const hasEnoughBalance = requiredAssets
        ?.map((it) => it.ok)
        .reduce((a, b) => a && b);
      if (!hasEnoughBalance)
        return { balance: false, slippage: true, routeChanged };
    }

    const slippages = route.result?.swaps?.map((s) => s.recommendedSlippage);
    const slippageError =
      (slippages?.filter((s) => !!s?.error)?.length || 0) > 0;
    const minSlippage =
      slippages
        ?.map((s) => parseFloat(s?.slippage.toString() || '0') || 0)
        .filter((s) => s > 0)
        .sort((a, b) => b - a)
        .find(() => true) || null;
    if (slippageError) {
      setError('Server cannot calculated required slippage for your swap');
      return { balance: true, slippage: false, routeChanged };
    } else if (minSlippage !== null && minSlippage > parseFloat(userSlippage)) {
      setError(`Your slippage should be ${minSlippage} at least`);
      return { balance: true, slippage: false, routeChanged };
    }

    return { balance: true, slippage: true, routeChanged };
  };

  const checkFeeAndBalance = async (
    selectedWallets: SelectedWallet[]
  ): Promise<CheckFeeAndBalanceResult> => {
    setLoading(true);
    setFeeStatus(null);

    const selectedWalletsMap = selectedWallets.reduce(
      (
        selectedWalletsMap: BestRouteRequest['selectedWallets'],
        selectedWallet
      ) => (
        (selectedWalletsMap[selectedWallet.chain] = selectedWallet.address),
        selectedWalletsMap
      ),
      {}
    );

    const connectedWallets: BestRouteRequest['connectedWallets'] = [];

    accounts.forEach((account) => {
      const chainAndAccounts = connectedWallets.find(
        (wallet) => wallet.blockchain
      );
      if (!!chainAndAccounts) chainAndAccounts.addresses.push(account.address);
      else
        connectedWallets.push({
          blockchain: account.chain,
          addresses: [account.address],
        });
    });

    const r = await httpService
      .getBestRoute({
        amount: inputAmount!.toString(),
        checkPrerequisites: true,
        from: {
          address: fromToken!.address,
          blockchain: fromToken!.blockchain,
          symbol: fromToken!.symbol,
        },
        to: {
          address: toToken!.address,
          blockchain: toToken!.blockchain,
          symbol: toToken!.symbol,
        },
        connectedWallets,
        selectedWallets: selectedWalletsMap,
        //@ts-ignore
        swapperGroups: disabledLiquiditySources,
        swappersGroupsExclude: true,
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    setLoading(false);
    if (!r || !r.result || !bestRoute) return { bestRoute: null };
    if (
      !new BigNumber(r.requestAmount).isEqualTo(
        new BigNumber(inputAmount || '-1')
      )
    )
      return null;
    setFeeStatus(r.validationStatus);
    const routeChangeStatus = compareRoutes(
      bestRoute,
      r,
      inputAmount!.toString(),
      fromToken!.usdPrice,
      toToken!.usdPrice
    );
    setBestRoute(r);
    const isChanged = routeChangeStatus.isChanged;
    // const changeWarningMessage = routeChangeStatus.warningMessage;
    setBestRouteChanged(isChanged);
    if (isChanged) setWarning('Best route changed');
    setData(r);
    return {
      hasEnoughBalanceOrSlippage: hasEnoughBalanceOrProperSlippage(
        r,
        selectedWallets,
        slippage.toString(),
        isChanged
      ),
      bestRoute: r,
    };
  };

  const swap = () => {
    if (!bestRoute) return;
    if (inputAmount!.toString() === '') return;
    // const wallets = selectedWallets.reduce(
    //   (
    //     selectedWalletsMap: { [p: string]: { address: string; walletType: WalletType } },
    //     selectedWallet,
    //   ) => (
    //     (selectedWalletsMap[selectedWallet.chain] = {
    //       address: selectedWallet.address,
    //       walletType: selectedWallet.walletType,
    //     }),
    //     selectedWalletsMap
    //   ),
    //   {},
    // );

    const proceedAnyway = enoughBalance !== null;

    const settings: SwapSavedSettings = {
      slippage: slippage.toString(),
      disabledSwappersGroups: ['Osmosis'],
      disabledSwappersIds: [],
    };
    if (proceedAnyway) {
      const newSwap: PendingSwap = calculatePendingSwap(
        inputAmount!.toString(),
        bestRoute,
        wallets,
        settings,
        false,
        tokens
      );
      console.log(newSwap);
    }

    !proceedAnyway &&
      checkFeeAndBalance(selectedWallets)
        .then((data) => {
          if (!data) {
            setError('confirm swap error');
            return;
          }

          if (!data.bestRoute) {
            setError('confirm swap error');
            return;
          } else {
            // @ts-ignore
            const { hasEnoughBalanceOrSlippage } = data;
            if (!hasEnoughBalanceOrSlippage) {
              return;
            }

            setEnoughBalance(
              hasEnoughBalanceOrSlippage.balance &&
                hasEnoughBalanceOrSlippage.slippage
            );

            if (
              hasEnoughBalanceOrSlippage.balance &&
              hasEnoughBalanceOrSlippage.slippage &&
              !hasEnoughBalanceOrSlippage.routeChanged
            ) {
              const newSwap: PendingSwap = calculatePendingSwap(
                inputAmount!.toString(),
                newBestRoute,
                wallets,
                settings,
                true,
                tokens
              );
              console.log(newSwap);
            } else if (!hasEnoughBalanceOrSlippage.balance) {
              setError('not enough balance');
            }
          }
        })
        .catch((error) => {
          console.log('unexpected error', error);
        });
  };
  return {
    loading,
    error,
    data,
    warning,
    feeStatus,
    bestRouteChanged,
    enoughBalance,
    swap,
  } as any;
}
