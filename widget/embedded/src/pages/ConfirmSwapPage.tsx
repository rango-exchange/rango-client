import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useWalletsStore } from '../store/wallets';
import { useWallets } from '@rango-dev/wallets-core';
import { navigationRoutes } from '../constants/navigationRoutes';
import {
  getKeplrCompatibleConnectedWallets,
  getRequiredChains,
  getSelectableWallets,
  isExperimentalChain,
} from '../utils/wallets';
import { confirmSwapDisabled, getTotalFeeInUsd, isValidCustomDestination } from '../utils/swap';
import { numberToString } from '../utils/numbers';
import { useMetaStore } from '../store/meta';
import { Network, WalletType } from '@rango-dev/wallets-shared';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { TokenPreview } from '../components/TokenPreview';
// @ts-ignore // TODO: fix error in tsc build
import { t } from 'i18next';
import { Divider, ConfirmSwap, LoadingFailedAlert } from '@rango-dev/ui';
import RoutesOverview from '../components/RoutesOverview';
import { useManager } from '@rango-dev/queue-manager-react';
import { useConfirmSwap } from '../hooks/useConfirmSwap';
import { useSettingsStore } from '../store/settings';
import { useUiStore } from '../store/ui';
import { ConfirmSwapErrorTypes } from '../types';
import { ConfirmSwapErrors } from '../components/ConfirmSwapErrors';
import { ConfirmSwapWarnings } from '../components/ConfirmSwapWarnings';
import { ConfirmSwapExtraMessages } from '../components/warnings/ConfirmSwapExtraMessages';
import { getBestRouteStatus } from '../utils/routing';
import { PercentageChange } from '../components/PercentageChange';

export function ConfirmSwapPage({
  customDestinationEnabled,
}: {
  customDestinationEnabled?: boolean;
}) {
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const bestRoute = useBestRouteStore.use.bestRoute();
  const fetchingBestRoute = useBestRouteStore.use.loading();
  const fetchingBestRouteError = useBestRouteStore.use.error();
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const { blockchains, tokens } = useMetaStore.use.meta();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const selectedWallets = useWalletsStore.use.selectedWallets();
  const customDestination = useWalletsStore.use.customDestination();
  const setCustomDestination = useWalletsStore.use.setCustomDestination();
  const initSelectedWallets = useWalletsStore.use.initSelectedWallets();
  const setSelectedWallet = useWalletsStore.use.setSelectedWallet();
  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const inputUsdValue = useBestRouteStore.use.inputUsdValue();
  const outputUsdValue = useBestRouteStore.use.outputUsdValue();
  const setInputAmount = useBestRouteStore.use.setInputAmount();
  const [dbErrorMessage, setDbErrorMessage] = useState<string>('');
  const bestRouteloadingStatus = getBestRouteStatus(fetchingBestRoute, !!fetchingBestRouteError);
  const [destinationChain, setDestinationChain] = useState<string>('');

  const { manager } = useManager();
  const { loading: fetchingConfirmedRoute, errors, warnings, confirmSwap } = useConfirmSwap();

  const selectedSlippage = customSlippage || slippage;

  const showHighSlippageWarning = !errors.find(
    (error) => error.type === ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE,
  );

  const { getWalletInfo, connect } = useWallets();

  const firstStep = bestRoute?.result?.swaps[0];
  const lastStep = bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1];

  const fromAmount = numberToString(firstStep?.fromAmount, 4, 6);
  const toAmount = numberToString(lastStep?.toAmount, 4, 6);
  useEffect(() => {
    initSelectedWallets();
    if (customDestination) {
      setCustomDestination('');
    }
  }, []);
  const lastStepToBlockchain =
    bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1].to.blockchain;
  const isWalletRequired = !!bestRoute?.result?.swaps.find(
    (swap) => swap.from.blockchain === lastStepToBlockchain,
  );

  const selectableWallets = getSelectableWallets(
    connectedWallets,
    selectedWallets,
    getWalletInfo,
    isWalletRequired ? '' : destinationChain,
  );

  const handleConnectChain = (wallet: string) => {
    const network = wallet as Network;
    getKeplrCompatibleConnectedWallets(selectableWallets).forEach((compatibleWallet: WalletType) =>
      connect?.(compatibleWallet, network),
    );
  };

  const totalFeeInUsd = getTotalFeeInUsd(bestRoute, tokens);

  return (
    <ConfirmSwap
      requiredWallets={getRequiredChains(bestRoute)}
      selectableWallets={selectableWallets}
      setCustomDestination={setCustomDestination}
      customDestination={customDestination}
      customDestinationEnabled={customDestinationEnabled}
      isValidCustomDestination={isValidCustomDestination}
      checkedDestination={!!destinationChain}
      setDestinationChain={setDestinationChain}
      onBack={navigateBackFrom.bind(null, navigationRoutes.confirmSwap)}
      onConfirm={async () => {
        confirmSwap?.().then(async (swap) => {
          if (swap) {
            try {
              console.log(11111);
              await manager?.create('swap', { swapDetails: swap }, { id: swap.requestId });
              console.log(22222);
              setSelectedSwap(swap.requestId);
              navigate('/' + navigationRoutes.swaps + `/${swap.requestId}`, {
                replace: true,
              });
              setTimeout(() => {
                setInputAmount('');
              }, 0);
            } catch (e) {
              console.log('eeeeeeeee');
              setDbErrorMessage('Error: ' + (e as any)?.message);
            }
          }
        });
      }}
      isWalletRequired={isWalletRequired}
      onChange={(wallet) => setSelectedWallet(wallet)}
      confirmDisabled={
        loadingMetaStatus !== 'success' ||
        confirmSwapDisabled(
          fetchingBestRoute,
          destinationChain,
          customDestination,
          bestRoute,
          selectableWallets,
        )
      }
      handleConnectChain={(wallet) => handleConnectChain(wallet)}
      isExperimentalChain={(wallet) =>
        getKeplrCompatibleConnectedWallets(selectableWallets).length > 0
          ? isExperimentalChain(blockchains, wallet)
          : false
      }
      previewInputs={
        <>
          <TokenPreview
            chain={{
              displayName: firstStep?.from.blockchain || '',
              logo: firstStep?.from.blockchainLogo || '',
            }}
            token={{
              symbol: firstStep?.from.symbol || '',
              image: firstStep?.from.logo || '',
            }}
            usdValue={inputUsdValue}
            amount={fromAmount}
            label={t('From')}
            loadingStatus={
              loadingMetaStatus !== 'success' ? loadingMetaStatus : bestRouteloadingStatus
            }
          />
          <Divider size={12} />
          <TokenPreview
            chain={{
              displayName: lastStep?.to.blockchain || '',
              logo: lastStep?.to.blockchainLogo || '',
            }}
            token={{
              symbol: lastStep?.to.symbol || '',
              image: lastStep?.to.logo || '',
            }}
            usdValue={outputUsdValue}
            amount={toAmount}
            label={t('To')}
            loadingStatus={
              loadingMetaStatus !== 'success' ? loadingMetaStatus : bestRouteloadingStatus
            }
            percentageChange={
              <PercentageChange inputUsdValue={inputUsdValue} outputUsdValue={outputUsdValue} />
            }
          />
        </>
      }
      previewRoutes={
        <RoutesOverview routes={bestRoute} totalFee={numberToString(totalFeeInUsd, 0, 2)} />
      }
      loading={fetchingConfirmedRoute}
      errors={
        dbErrorMessage ? [dbErrorMessage, ...ConfirmSwapErrors(errors)] : ConfirmSwapErrors(errors)
      }
      warnings={ConfirmSwapWarnings(warnings)}
      extraMessages={
        <>
          {loadingMetaStatus === 'failed' && <LoadingFailedAlert />}
          {loadingMetaStatus === 'failed' && showHighSlippageWarning && <Divider />}
          {showHighSlippageWarning && (
            <ConfirmSwapExtraMessages selectedSlippage={selectedSlippage} />
          )}
        </>
      }
      confirmButtonTitle={
        warnings.length > 0 || errors.length > 0 ? 'Proceed anyway!' : 'Confirm swap!'
      }
    />
  );
}
