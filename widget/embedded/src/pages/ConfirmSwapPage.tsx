/* eslint-disable @typescript-eslint/no-magic-numbers */
import type {
  ConfirmSwap,
  ConfirmSwapFetchResult,
} from '../hooks/useConfirmSwap';
import type { WidgetConfig } from '../types';
import type { PriceImpactWarningLevel } from '@rango-dev/ui/dist/widget/ui/src/components/PriceImpact/PriceImpact.types';

import { i18n } from '@lingui/core';
import { useManager } from '@rango-dev/queue-manager-react';
import {
  Alert,
  BestRoute,
  BestRouteSkeleton,
  Button,
  Divider,
  IconButton,
  MessageBox,
  Modal,
  RefreshIcon,
  SettingsIcon,
  styled,
  Tooltip,
  Typography,
  WalletIcon,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import {
  formatBestRoute,
  getRequiredWallets,
} from '../components/ConfirmWalletsModal/ConfirmWallets.helpers';
import { ConfirmWalletsModal } from '../components/ConfirmWalletsModal/ConfirmWalletsModal';
import { HeaderButton } from '../components/HeaderButtons/HeaderButtons.styles';
import { Layout } from '../components/Layout';
import { NoRoutes } from '../components/NoRoutes';
import { getConfirmSwapErrorMessage } from '../constants/errors';
import { navigationRoutes } from '../constants/navigationRoutes';
import { HIGHT_PRICE_IMPACT, LOW_PRICE_IMPACT } from '../constants/routing';
import { getRouteWarningMessage } from '../constants/warnings';
import { useConfirmSwap } from '../hooks/useConfirmSwap';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { useUiStore } from '../store/ui';
import { useWalletsStore } from '../store/wallets';
import {
  ConfirmSwapErrorTypes,
  RouteWarningType,
  SlippageWarningType,
} from '../types';
import {
  numberToString,
  secondsToString,
  totalArrivalTime,
} from '../utils/numbers';
import { getPercentageChange, getTotalFeeInUsd } from '../utils/swap';

const Container = styled('div', {
  position: 'relative',
  width: '100%',
  '& .description': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '$10',
  },
  '& .icon': {
    width: '$24',
    height: '$24',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Buttons = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  '& .confirm-button': {
    flexGrow: 1,
    paddingRight: '$10',
  },
  [`& ${IconButton}`]: {
    width: '$48',
    height: '$48',
  },
});

type PropTypes = {
  config?: WidgetConfig;
};

export function ConfirmSwapPage(props: PropTypes) {
  //TODO: move component's logics to a custom hook
  const { config } = props;
  const {
    bestRoute,
    inputAmount,
    outputAmount,
    inputUsdValue,
    outputUsdValue,
    setInputAmount,
    selectedWallets,
    routeWalletsConfirmed,
    setRouteWalletConfirmed,
    customDestination,
  } = useBestRouteStore();
  const navigate = useNavigate();
  const [dbErrorMessage, setDbErrorMessage] = useState<string>('');
  const [showSlippageWarning, setShowSlippageWarning] = useState(false);

  const { connectedWallets } = useWalletsStore();
  const showWalletsOnInit = !routeWalletsConfirmed;
  const [showWallets, setShowWallets] = useState(false);
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const { tokens } = useMetaStore.use.meta();
  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const { manager } = useManager();
  const selectedSlippage = customSlippage || slippage;
  const {
    fetch: confirmSwap,
    loading: fetchingConfirmationRoute,
    cancelFetch,
  } = useConfirmSwap();
  const [confirmSwapResult, setConfirmSwapResult] =
    useState<ConfirmSwapFetchResult>({
      swap: null,
      error: null,
      warnings: null,
    });
  const showNoRouteFound =
    !fetchingConfirmationRoute &&
    confirmSwapResult.error &&
    [
      ConfirmSwapErrorTypes.NO_ROUTE,
      ConfirmSwapErrorTypes.REQUEST_FAILED,
    ].includes(confirmSwapResult.error.type);
  const showBestRoute =
    !showNoRouteFound &&
    !fetchingConfirmationRoute &&
    bestRoute &&
    bestRoute.result;

  const totalFeeInUsd = getTotalFeeInUsd(bestRoute, tokens);
  const percentageChange = numberToString(
    getPercentageChange(
      inputUsdValue?.toNumber() ?? 0,
      outputUsdValue?.toNumber() ?? 0
    ),
    2,
    2
  );
  let warningLevel: PriceImpactWarningLevel = undefined;
  if (parseFloat(percentageChange) >= HIGHT_PRICE_IMPACT) {
    warningLevel = 'high';
  } else if (parseFloat(percentageChange) >= LOW_PRICE_IMPACT) {
    warningLevel = 'low';
  }

  const onConfirmSwap: ConfirmSwap['fetch'] = async ({
    selectedWallets,
    customDestination,
  }) => {
    const result = await confirmSwap?.({ selectedWallets, customDestination });
    setConfirmSwapResult(result);
    return result;
  };

  const addNewSwap = async () => {
    if (confirmSwapResult.swap && routeWalletsConfirmed) {
      try {
        await manager?.create(
          'swap',
          { swapDetails: confirmSwapResult.swap },
          { id: confirmSwapResult.swap.requestId }
        );
        setSelectedSwap(confirmSwapResult.swap.requestId);
        navigate(
          '/' + navigationRoutes.swaps + `/${confirmSwapResult.swap.requestId}`,
          {
            replace: true,
          }
        );
        setTimeout(() => {
          setInputAmount('');
        }, 0);
      } catch (e) {
        setDbErrorMessage('Error: ' + (e as any)?.message);
      }
    }
  };

  const onConfirm = async () => {
    await addNewSwap();
  };

  const onStartConfirmSwap = async () => {
    if (confirmSwapResult?.warnings?.slippage) {
      setShowSlippageWarning(true);
    } else {
      await onConfirm();
    }
  };

  const onRefresh = async () => {
    setConfirmSwapResult({
      error: null,
      swap: null,
      warnings: null,
    });
    confirmSwap({ selectedWallets })
      .then((res) => {
        setConfirmSwapResult(res);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (showWalletsOnInit) {
      cancelFetch();
    }
  }, [showWalletsOnInit]);

  useEffect(() => {
    if (showWalletsOnInit) {
      setShowWallets(showWalletsOnInit);
    }
  }, [showWalletsOnInit]);

  useEffect(() => {
    if (!showWalletsOnInit) {
      confirmSwap({ selectedWallets, customDestination })
        .then((result) => setConfirmSwapResult(result))
        .catch((error) => console.error(error));
    }
  }, []);

  useEffect(() => {
    if (!showWallets && !routeWalletsConfirmed) {
      navigate(navigationRoutes.home, { replace: true });
    }
  }, [showWallets, routeWalletsConfirmed]);

  useEffect(() => {
    const routeChanged =
      confirmSwapResult.warnings?.route?.type &&
      Object.values(RouteWarningType).includes(
        confirmSwapResult.warnings?.route?.type
      );

    const selectedWalletDisconnected =
      selectedWallets.length < 1 ||
      !selectedWallets.every((selectedWallet) =>
        connectedWallets.find(
          (connectedWallet) =>
            selectedWallet.address === connectedWallet.address &&
            selectedWallet.walletType === connectedWallet.walletType &&
            selectedWallet.chain === connectedWallet.chain
        )
      );

    let routeWalletsChanged = false;

    if (routeChanged) {
      let requiredWallets = getRequiredWallets(bestRoute);

      const lastStepToBlockchain =
        bestRoute?.result?.swaps[bestRoute.result.swaps.length - 1].to
          .blockchain;

      const isLastWalletRequired = !!bestRoute?.result?.swaps.find(
        (swap) => swap.from.blockchain === lastStepToBlockchain
      );

      if (!isLastWalletRequired) {
        requiredWallets = requiredWallets.slice(
          -requiredWallets.length,
          requiredWallets.length - 1
        );
      }

      const allRequiredWalletsSelected = requiredWallets.every(
        (requiredWallet) =>
          selectedWallets.find(
            (selectedWallet) => selectedWallet.chain === requiredWallet
          )
      );

      if (!allRequiredWalletsSelected) {
        routeWalletsChanged = true;
      }
    }

    if (bestRoute && (selectedWalletDisconnected || routeWalletsChanged)) {
      queueMicrotask(() => flushSync(setShowWallets.bind(null, true)));
      setRouteWalletConfirmed(false);
    }
  }, [
    confirmSwapResult.warnings?.route,
    selectedWallets.length,
    connectedWallets.length,
  ]);

  return (
    <Layout
      header={{
        title: 'Confirm Swap',
        onBack: navigate.bind(null, -1),
        hasConnectWallet: true,
        suffix: (
          <Tooltip side="bottom" content={i18n.t('Settings')}>
            <HeaderButton
              size="small"
              variant="ghost"
              onClick={() => navigate('/' + navigationRoutes.settings)}>
              <SettingsIcon size={18} color="black" />
            </HeaderButton>
          </Tooltip>
        ),
      }}
      footer={
        <Buttons>
          <div className="confirm-button">
            <Button
              variant="contained"
              type="primary"
              size="large"
              fullWidth
              loading={fetchingConfirmationRoute}
              disabled={!!confirmSwapResult.error}
              onClick={onStartConfirmSwap}>
              Start Swap
            </Button>
          </div>
          <IconButton
            variant="contained"
            type="primary"
            size="large"
            loading={fetchingConfirmationRoute}
            onClick={setShowWallets.bind(null, true)}>
            <WalletIcon size={24} />
          </IconButton>
        </Buttons>
      }>
      <Modal
        anchor="bottom"
        open={showSlippageWarning}
        prefix={
          <Button
            size="small"
            variant="ghost"
            onClick={() => navigate('/' + navigationRoutes.settings)}>
            <Typography variant="label" size="medium" color="$neutral900">
              Change settings
            </Typography>
          </Button>
        }
        container={document.querySelector('#swap-box') as HTMLDivElement}
        onClose={setShowSlippageWarning.bind(null, (prevState) => !prevState)}>
        {confirmSwapResult.warnings?.slippage && (
          <MessageBox
            type="warning"
            title={
              confirmSwapResult.warnings.slippage.type ===
              SlippageWarningType.HIGH_SLIPPAGE
                ? 'High slippage'
                : 'Low slippage'
            }
            description={
              confirmSwapResult.warnings.slippage.type ===
              SlippageWarningType.HIGH_SLIPPAGE
                ? i18n.t(
                    'highSlippage',
                    { selectedSlippage },
                    {
                      message:
                        ' Caution, your slippage is high (={selectedSlippage}). Your trade may be front run.',
                    }
                  )
                : i18n.t(
                    'increaseSlippage',

                    {
                      minRequiredSlippage:
                        confirmSwapResult.warnings.slippage.slippage,
                    },
                    {
                      message:
                        'We recommend you to increase slippage to at least {minRequiredSlippage} for this route.',
                    }
                  )
            }>
            <Divider size={18} />
            <Divider size={32} />
            <Button
              size="large"
              type="primary"
              variant="contained"
              fullWidth
              onClick={onConfirm}>
              Confirm anyway
            </Button>
          </MessageBox>
        )}
      </Modal>
      {showWallets && (
        <ConfirmWalletsModal
          open={showWallets}
          onClose={setShowWallets.bind(null, false)}
          onCancel={cancelFetch}
          loading={fetchingConfirmationRoute}
          onCheckBalance={onConfirmSwap}
          config={config}
        />
      )}

      <Container>
        <div className="description">
          <Typography variant="title" size="small">
            You get
          </Typography>
          <Button
            style={{ padding: '0' }}
            variant="ghost"
            disabled={fetchingConfirmationRoute}
            onClick={onRefresh}>
            <div className="icon">
              <RefreshIcon size={16} />
            </div>
          </Button>
        </div>
        {dbErrorMessage && (
          <>
            <Alert type="error" variant="alarm" title={dbErrorMessage} />
            <Divider size={12} />
          </>
        )}
        {confirmSwapResult.warnings?.route && (
          <>
            <Alert
              variant="alarm"
              type="warning"
              title={getRouteWarningMessage(confirmSwapResult.warnings.route)}
            />
            <Divider size={12} />
          </>
        )}
        {fetchingConfirmationRoute && (
          <BestRouteSkeleton type="swap-preview" expanded />
        )}
        {showBestRoute && (
          <BestRoute
            expanded={true}
            steps={formatBestRoute(bestRoute) ?? []}
            input={{
              value: numberToString(inputAmount, 6, 6),
              usdValue: numberToString(inputUsdValue, 6, 6),
            }}
            output={{
              value: numberToString(outputAmount, 6, 6),
              usdValue: numberToString(outputUsdValue, 6, 6),
            }}
            totalFee={numberToString(totalFeeInUsd, 0, 2)}
            totalTime={secondsToString(totalArrivalTime(bestRoute))}
            recommended={true}
            type="swap-preview"
            percentageChange={percentageChange}
            warningLevel={warningLevel}
          />
        )}
        {showNoRouteFound && (
          <>
            <Divider size={12} />
            <NoRoutes
              diagnosisMessage={
                confirmSwapResult.error?.type === ConfirmSwapErrorTypes.NO_ROUTE
                  ? confirmSwapResult.error.diagnosisMessage
                  : undefined
              }
              error={
                confirmSwapResult.error?.type ===
                ConfirmSwapErrorTypes.REQUEST_FAILED
              }
              fetch={onRefresh}
            />
          </>
        )}
        {confirmSwapResult.error?.type ===
          ConfirmSwapErrorTypes.ROUTE_UPDATED_WITH_HIGH_VALUE_LOSS && (
          <>
            <Alert
              variant="alarm"
              type="error"
              title={getConfirmSwapErrorMessage(confirmSwapResult.error)}
            />
            <Divider size={12} />
          </>
        )}
      </Container>
    </Layout>
  );
}
