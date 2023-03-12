import { PendingSwap } from '@rango-dev/ui/dist/containers/History/types';
import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { subscribeWithSelector } from 'zustand/middleware';
import { BalanceWarnings } from '../components/warnings/BalanceWarnings';
import { MinRequiredSlippage } from '../components/warnings/MinRequiredSlippage';
import { httpService } from '../services/httpService';
import { PendingSwapSettings } from '../types';
import { numberToString } from '../utils/numbers';
import {
  isRouteChanged,
  isNumberOfSwapsChanged,
  isRouteSwappersUpdated,
  isRouteInternalCoinsUpdated,
} from '../utils/routing';
import {
  createBestRouteRequestBody,
  getOutputRatio,
  outputRatioHasWarning,
  isOutputAmountChangedALot,
  getRouteOutputAmount,
  getPercentageChange,
  getBalanceWarnings,
  getMinRequiredSlippage,
  hasProperSlippage,
  calculatePendingSwap,
  getWalletsForNewSwap,
} from '../utils/swap';
import { useBestRouteStore } from './bestRoute';
import { useMetaStore } from './meta';
import createSelectors from './selectors';
import { useSettingsStore } from './settings';
import { useWalletsStore } from './wallets';

interface ConfirmSwapState {
  loading: boolean;
  errors: string[];
  warnings: string[];
  swapConfirmed: boolean;
}

export const useConfirmSwapStore = createSelectors(
  create<ConfirmSwapState>()(
    subscribeWithSelector((set) => ({
      loading: false,
      errors: [],
      warnings: [],
      swapConfirmed: false,
    }))
  )
);

let abortController: AbortController | null = null;

export const confirmSwap = () => {
  console.log('confirm swap');
  const {
    fromToken,
    toToken,
    inputAmount,
    bestRoute,
    inputUsdValue,
    setBestRoute,
  } = useBestRouteStore.getState();
  const { accounts, selectedWallets } = useWalletsStore.getState();
  const { swapConfirmed } = useConfirmSwapStore.getState();
  const { disabledLiquiditySources, slippage, customSlippage } =
    useSettingsStore.getState();
  const {
    meta: { tokens },
  } = useMetaStore.getState();
  const userSlippage = customSlippage || slippage;
  abortController = new AbortController();
  if (!fromToken || !toToken || !inputAmount || !bestRoute) return;

  useConfirmSwapStore.setState({ loading: true });

  const requestBody = createBestRouteRequestBody(
    fromToken,
    toToken,
    inputAmount,
    accounts,
    selectedWallets,
    disabledLiquiditySources
  );
  useBestRouteStore.subscribe(
    (state) => state.bestRoute,
    (state) => {
      abortController.abort();
    },
    { equalityFn: shallow }
  );
  useWalletsStore.subscribe(
    (state) => state.selectedWallets,
    (state) => {
      abortController.abort();
    },
    {
      equalityFn: (a, b) => {
        const cond = b.every(
          (item) =>
            !!a.find(
              (i) => item.address === i.address && item.chain === i.chain
            )
        );
        if (cond) return true;
        else return false;
      },
    }
  );

  httpService
    .getBestRoute(requestBody)
    .then((confirmBestRoute) => {
      useConfirmSwapStore.setState({ loading: false, errors: ['fsdffd'] });
      if (!confirmBestRoute || !confirmBestRoute.result || !bestRoute)
        useConfirmSwapStore.setState((prevState) => ({
          errors: prevState.errors.concat('no routes found'),
        }));
      if (
        !!confirmBestRoute &&
        !new BigNumber(confirmBestRoute.requestAmount).isEqualTo(
          new BigNumber(inputAmount || '-1')
        )
      )
        useConfirmSwapStore.setState((prevState) => ({
          errors: prevState.errors.concat(
            'No routes found. Please try again later.'
          ),
        }));
      const routeChanged = isRouteChanged(bestRoute, confirmBestRoute!);

      setBestRoute(confirmBestRoute!);
      if (routeChanged) {
        const newRouteOutputUsdValue = new BigNumber(
          confirmBestRoute.result?.outputAmount || '0'
        ).multipliedBy(toToken.usdPrice || 0);

        const outputRatio = getOutputRatio(
          inputUsdValue,
          newRouteOutputUsdValue
        );
        const highValueLoss = outputRatioHasWarning(inputUsdValue, outputRatio);

        if (isNumberOfSwapsChanged(bestRoute, confirmBestRoute))
          useConfirmSwapStore.setState((prevState) => ({
            warnings: prevState.warnings.concat('Route has been updated.'),
          }));
        if (isRouteSwappersUpdated(bestRoute, confirmBestRoute))
          useConfirmSwapStore.setState((prevState) => ({
            warnings: prevState.warnings.concat(
              'Route swappers has been updated.'
            ),
          }));
        if (isRouteInternalCoinsUpdated(bestRoute, confirmBestRoute))
          useConfirmSwapStore.setState((prevState) => ({
            warnings: prevState.warnings.concat(
              'Route internal coins has been updated.'
            ),
          }));
        if (highValueLoss)
          useConfirmSwapStore.setState((prevState) => ({
            errors: prevState.errors.concat(
              'Route updated and price impact is too high, try again later!'
            ),
          }));
        if (isOutputAmountChangedALot(bestRoute, confirmBestRoute))
          useConfirmSwapStore.setState((prevState) => ({
            warnings: prevState.warnings.concat(
              `Output amount changed to ${numberToString(
                getRouteOutputAmount(confirmBestRoute)
              )} 
      (${numberToString(
        getPercentageChange(
          getRouteOutputAmount(bestRoute)!,
          getRouteOutputAmount(confirmBestRoute)!
        ),
        null,
        2
      )}% change).`
            ),
          }));
      }

      const balanceWarnings = getBalanceWarnings(
        confirmBestRoute,
        selectedWallets
      );
      const enoughBalance = balanceWarnings.length === 0;

      if (!enoughBalance) {
        useConfirmSwapStore.setState((prevState) => ({
          warnings: prevState.warnings.concat(
            //   BalanceWarnings(balanceWarnings) as any
            'balance warning'
          ),
        }));
      }

      const minRequiredSlippage = getMinRequiredSlippage(bestRoute);
      if (!hasProperSlippage(userSlippage.toString(), minRequiredSlippage))
        useConfirmSwapStore.setState((prevState) => ({
          errors:
            //   MinRequiredSlippage(minRequiredSlippage) as any
            ['min slippage warning'],
        }));

      if (!routeChanged || (routeChanged && swapConfirmed)) {
        const swapSettings: PendingSwapSettings = {
          slippage: userSlippage.toString(),
          disabledSwappersGroups: disabledLiquiditySources,
        };
        const newSwap: PendingSwap = calculatePendingSwap(
          inputAmount!.toString(),
          bestRoute!,
          getWalletsForNewSwap(selectedWallets),
          swapSettings,
          false,
          tokens
        );
        console.log('new swap:', newSwap);
        useConfirmSwapStore.setState({
          loading: false,
          //   errors: [],
          //   warnings: [],
          swapConfirmed: false,
        });
      } else if (!swapConfirmed)
        useConfirmSwapStore.setState({ swapConfirmed: true });

      abortController = null;
    })
    .catch((error) => {
      if (error.code === 'ERR_CANCELED') {
        useConfirmSwapStore.setState({
          loading: false,
          //   errors: [],
          //   warnings: [],
          swapConfirmed: false,
        });
      }
      useConfirmSwapStore.setState({ loading: false });
      if (error.message)
        useConfirmSwapStore.setState((prevState) => ({
          errors: prevState.errors.concat(error.message),
        }));
      else if (!!error.response)
        useConfirmSwapStore.setState((prevState) => ({
          errors: prevState.errors.concat(
            `Failed to confirm swap 'status': ${error.response.status}), please try again.`
          ),
        }));
      else
        useConfirmSwapStore.setState((prevState) => ({
          errors: prevState.errors.concat(
            'Failed to confirm swap, please try again.'
          ),
        }));
    });
};
