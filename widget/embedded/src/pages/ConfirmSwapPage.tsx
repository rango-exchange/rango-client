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
  Button,
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
import { useNavigate } from 'react-router-dom';

import { formatBestRoute } from '../components/ConfirmWalletsModal/ConfirmWallets.helpers';
import { ConfirmWalletsModal } from '../components/ConfirmWalletsModal/ConfirmWalletsModal';
import { HeaderButton } from '../components/HeaderButtons/HeaderButtons.styles';
import { Layout } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { HIGHT_PRICE_IMPACT, LOW_PRICE_IMPACT } from '../constants/routing';
import { useConfirmSwap } from '../hooks/useConfirmSwap';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { useUiStore } from '../store/ui';
import { useWalletsStore } from '../store/wallets';
import { SlippageWarningType } from '../types';
import {
  numberToString,
  secondsToString,
  totalArrivalTime,
} from '../utils/numbers';
import {
  confirmSwapDisabled,
  getConfirmSwapErrorMessage,
  getPercentageChange,
  getRouteWarningMessage,
  getTotalFeeInUsd,
} from '../utils/swap';

const Container = styled('div', {
  position: 'relative',
  width: '100%',
  height: '593px',
  '& .title': {
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
  '& .buttons': {
    width: '100%',
    position: 'absolute',
    bottom: '$0',
    display: 'flex',
    justifyContent: 'space-between',
    filter: 'drop-shadow(white 0 -10px 10px)',
  },
  '& .confirm-button': {
    flexGrow: 1,
    paddingRight: '$10',
  },
});

type PropTypes = {
  config?: WidgetConfig;
};

export function ConfirmSwapPage(props: PropTypes) {
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
  } = useBestRouteStore();
  const navigate = useNavigate();
  const [showWallets, setShowWallets] = useState(false);
  const [dbErrorMessage, setDbErrorMessage] = useState<string>('');
  const [showSlippageWarning, setShowSlippageWarning] = useState(false);

  const { customDestination, connectedWallets } = useWalletsStore();
  const showWalletsOnInit = !routeWalletsConfirmed;
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const { tokens, blockchains } = useMetaStore.use.meta();
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
  const showBestRoute =
    !fetchingConfirmationRoute && bestRoute && bestRoute.result;
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

  const onClick = async () => {
    if (confirmSwapResult?.warnings?.slippage) {
      setShowSlippageWarning(true);
    } else {
      await onConfirm();
    }
  };

  useEffect(() => {
    if (showWalletsOnInit) {
      setShowWallets(showWalletsOnInit);
    }
  }, [showWalletsOnInit]);

  useEffect(() => {
    if (!showWalletsOnInit) {
      confirmSwap({ selectedWallets, customDestination })
        .then((result) => setConfirmSwapResult(result))
        .catch((error) => console.log(error));
    }
  }, []);

  useEffect(() => {
    if (!showWallets && !routeWalletsConfirmed) {
      navigate(navigationRoutes.home, { replace: true });
    }
  }, [showWallets, routeWalletsConfirmed]);

  useEffect(() => {
    const destination = blockchains.find(
      (blockchain) =>
        blockchain.name ===
        bestRoute?.result?.swaps[bestRoute.result.swaps.length - 1].to
          .blockchain
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

    const routeWalletsChanged = confirmSwapDisabled(
      fetchingConfirmationRoute,
      !!customDestination,
      customDestination,
      bestRoute,
      selectedWallets,
      destination
    );

    if (selectedWalletDisconnected || routeWalletsChanged) {
      setShowWallets(true);
    }
  }, [bestRoute, connectedWallets.length]);

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
      }}>
      <Modal
        anchor="bottom"
        open={showSlippageWarning}
        prefix={
          <Button
            size="small"
            onClick={() => navigate('/' + navigationRoutes.settings)}>
            <Typography variant="label" size="medium" color="$neutral500">
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
            <Button
              style={{ marginTop: '10px' }}
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
        {confirmSwapResult.error && (
          <Alert type="error">
            {getConfirmSwapErrorMessage(confirmSwapResult.error)}
          </Alert>
        )}
        {dbErrorMessage && <Alert type="error" title={dbErrorMessage} />}
        {confirmSwapResult.warnings?.route && (
          <Alert type="warning">
            {getRouteWarningMessage(confirmSwapResult.warnings.route)}
          </Alert>
        )}

        <div className="title">
          <Typography variant="title" size="small">
            You get
          </Typography>
          <Button
            variant="ghost"
            disabled={fetchingConfirmationRoute}
            onClick={async () => {
              await confirmSwap?.({ selectedWallets });
              await confirmSwap?.({ selectedWallets });
            }}>
            <div className="icon">
              <RefreshIcon size={16} />
            </div>
          </Button>
        </div>
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
        <div className="buttons">
          <div className="confirm-button">
            <Button
              variant="contained"
              type="primary"
              size="large"
              fullWidth
              loading={fetchingConfirmationRoute}
              onClick={onClick}>
              Start Swap
            </Button>
          </div>
          <IconButton
            variant="contained"
            type="primary"
            size="large"
            style={{ width: '48px', height: '48px' }}
            loading={fetchingConfirmationRoute}
            onClick={setShowWallets.bind(null, true)}>
            <WalletIcon size={24} />
          </IconButton>
        </div>
      </Container>
    </Layout>
  );
}
