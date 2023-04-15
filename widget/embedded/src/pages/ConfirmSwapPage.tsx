import React, { useEffect } from 'react';
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
import {
  calcOutputUsdValue,
  getTotalFeeInUsd,
  requiredWallets,
} from '../utils/swap';
import { decimalNumber, numberToString } from '../utils/numbers';
import { useMetaStore } from '../store/meta';
import { Network, WalletType } from '@rango-dev/wallets-shared';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { TokenPreview } from '../components/TokenPreview';
// @ts-ignore // TODO: fix error in tsc build
import { t } from 'i18next';
import { Spacer, ConfirmSwap } from '@rango-dev/ui';
import RoutesOverview from '../components/RoutesOverview';
import { useManager } from '@rango-dev/queue-manager-react';
import { useConfirmSwap } from '../hooks/useConfirmSwap';
import { useSettingsStore } from '../store/settings';
import { useUiStore } from '../store/ui';
import { ConfirmSwapErrorTypes } from '../types';
import { ConfirmSwapErrors } from '../components/ConfirmSwapErrors';
import { ConfirmSwapWarnings } from '../components/ConfirmSwapWarnings';
import { ConfirmSwapExtraMessages } from '../components/warnings/ConfirmSwapExtraMessages';

export function ConfirmSwapPage() {
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const bestRoute = useBestRouteStore.use.bestRoute();
  const fetchingBestRoute = useBestRouteStore.use.loading();
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const { blockchains, tokens } = useMetaStore.use.meta();
  const accounts = useWalletsStore.use.accounts();
  const selectedWallets = useWalletsStore.use.selectedWallets();
  const initSelectedWallets = useWalletsStore.use.initSelectedWallets();
  const setSelectedWallet = useWalletsStore.use.setSelectedWallet();
  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();

  const { manager } = useManager();
  const { loading, errors, warnings, confirmSwap } = useConfirmSwap();

  const selectedSlippage = customSlippage || slippage;

  const showHighSlippageWarning = !errors.find(
    (error) => error.type === ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE
  );

  const { getWalletInfo, connect } = useWallets();
  const confirmDisabled =
    fetchingBestRoute ||
    !requiredWallets(bestRoute).every((chain) =>
      selectedWallets.map((wallet) => wallet.chain).includes(chain)
    );

  const firstStep = bestRoute?.result?.swaps[0];
  const lastStep =
    bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1];

  const fromAmount = decimalNumber(firstStep?.fromAmount, 3);
  const toAmount = decimalNumber(lastStep?.toAmount, 3);
  useEffect(() => {
    initSelectedWallets();
  }, []);

  const selectableWallets = getSelectableWallets(
    accounts,
    selectedWallets,
    getWalletInfo
  );

  const handleConnectChain = (wallet: string) => {
    const network = wallet as Network;
    getKeplrCompatibleConnectedWallets(selectableWallets).forEach(
      (compatibleWallet: WalletType) => connect?.(compatibleWallet, network)
    );
  };

  const totalFeeInUsd = getTotalFeeInUsd(bestRoute, tokens);

  return (
    <ConfirmSwap
      requiredWallets={getRequiredChains(bestRoute)}
      selectableWallets={selectableWallets}
      onBack={navigateBackFrom.bind(null, navigationRoutes.confirmSwap)}
      onConfirm={() => {
        confirmSwap?.().then((swap) => {
          if (swap) {
            manager?.create(
              'swap',
              { swapDetails: swap },
              { id: swap.requestId }
            );
            setSelectedSwap(swap.requestId);
            navigate(navigationRoutes.swaps + `/${swap.requestId}`, {
              replace: true,
            });
          }
        });
      }}
      onChange={(wallet) => setSelectedWallet(wallet)}
      confirmDisabled={confirmDisabled}
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
            usdValue={calcOutputUsdValue(fromAmount, firstStep?.from.usdPrice)}
            amount={fromAmount}
            label={t('From')}
            loadingStatus={'success'}
          />
          <Spacer size={12} direction="vertical" />
          <TokenPreview
            chain={{
              displayName: lastStep?.to.blockchain || '',
              logo: lastStep?.to.blockchainLogo || '',
            }}
            token={{
              symbol: lastStep?.to.symbol || '',
              image: lastStep?.to.logo || '',
            }}
            usdValue={calcOutputUsdValue(toAmount, lastStep?.to.usdPrice)}
            amount={toAmount}
            label={t('To')}
            loadingStatus={'success'}
          />
        </>
      }
      previewRoutes={
        <RoutesOverview
          routes={bestRoute}
          totalFee={numberToString(totalFeeInUsd, 0, 2)}
        />
      }
      loading={loading}
      errors={ConfirmSwapErrors(errors)}
      warnings={ConfirmSwapWarnings(warnings)}
      extraMessages={
        showHighSlippageWarning && (
          <ConfirmSwapExtraMessages selectedSlippage={selectedSlippage} />
        )
      }
      confirmButtonTitle={
        warnings.length > 0 || errors.length > 0
          ? 'Proceed anyway!'
          : 'Confirm swap!'
      }
    />
  );
}
