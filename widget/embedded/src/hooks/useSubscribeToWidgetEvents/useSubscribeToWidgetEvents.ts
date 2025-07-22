import type { ConnectedWallet, RouteEventData, StepEventData } from '../..';
import type { Asset } from 'rango-types';

import {
  isApprovalTX,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  WidgetEvents,
} from '@arlert-dev/queue-manager-rango-preset';
import { useEffect } from 'react';

import { eventEmitter } from '../../services/eventEmitter';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';

export function useSubscribeToWidgetEvents() {
  const setNotification = useNotificationStore.use.setNotification();
  const {
    connectedWallets,
    fetchBalances,
    customTokens: getCustomTokens,
  } = useAppStore();

  useEffect(() => {
    const handleStepEvent = (widgetEvent: StepEventData) => {
      const { event, step, route } = widgetEvent;

      /**
       * Determine if we should refetch balances:
       * - When a transaction is sent (TX_SENT) and it's not an approval transaction.
       * - When a step succeeds.
       */
      const shouldRefetchBalance =
        (event.type === StepEventType.TX_EXECUTION &&
          event.status === StepExecutionEventStatus.TX_SENT &&
          !isApprovalTX(step)) ||
        event.type === StepEventType.SUCCEEDED;

      if (shouldRefetchBalance) {
        const fetchBalanceAccounts: ConnectedWallet[] = [];

        /**
         * Identify the wallet corresponding to the `from` blockchain and match it with a connected wallet.
         * If found, add it to the balance fetch list.
         */
        const fromWallet = route.wallets[step?.fromBlockchain];
        if (fromWallet) {
          const fromAccount = connectedWallets.find(
            (connectedWallet) =>
              connectedWallet.address?.toLocaleLowerCase() ===
                fromWallet.address?.toLocaleLowerCase() &&
              connectedWallet.walletType === fromWallet.walletType &&
              connectedWallet.chain === step?.fromBlockchain
          );
          if (fromAccount) {
            fetchBalanceAccounts.push(fromAccount);
          }
        }

        /**
         * If the transaction is cross-chain (`fromBlockchain !== toBlockchain`),
         * find and add the `to` blockchain wallet to the balance fetch list.
         */
        if (step?.fromBlockchain !== step?.toBlockchain) {
          const toWallet = route.wallets[step?.toBlockchain];
          if (toWallet) {
            const toAccount = connectedWallets.find(
              (connectedWallet) =>
                connectedWallet.address?.toLocaleLowerCase() ===
                  toWallet.address?.toLocaleLowerCase() &&
                connectedWallet.walletType === toWallet.walletType &&
                connectedWallet.chain === step?.toBlockchain
            );
            if (toAccount) {
              fetchBalanceAccounts.push(toAccount);
            }
          }
        }

        if (fetchBalanceAccounts.length > 0) {
          const customTokens = getCustomTokens();
          const stepAssets: Asset[] = [
            {
              blockchain: step.fromBlockchain,
              address: step.fromSymbolAddress,
              symbol: step.fromSymbol,
            },
            {
              blockchain: step.toBlockchain,
              address: step.toSymbolAddress,
              symbol: step.toSymbol,
            },
          ];
          const selectedCustomTokens = stepAssets.filter((asset) =>
            customTokens.some(
              (token) =>
                token.blockchain === asset.blockchain &&
                token.address?.toLocaleLowerCase() ===
                  asset.address?.toLocaleLowerCase() &&
                token.symbol?.toLocaleLowerCase() ===
                  asset.symbol?.toLocaleLowerCase()
            )
          );

          void fetchBalances(fetchBalanceAccounts, {
            selectedCustomTokens,
            shouldFetchCustomTokens: selectedCustomTokens.length > 0,
          });
        }
      }

      setNotification(event, route);
    };
    eventEmitter.on(WidgetEvents.StepEvent, handleStepEvent);
    return () => eventEmitter.off(WidgetEvents.StepEvent, handleStepEvent);
  }, [eventEmitter, connectedWallets]);

  useEffect(() => {
    const handleRouteEvent = (widgetEvent: RouteEventData) => {
      const { event, route } = widgetEvent;

      if (
        event.type === RouteEventType.FAILED ||
        event.type === RouteEventType.SUCCEEDED
      ) {
        setNotification(event, route);
      }
    };
    eventEmitter.on(WidgetEvents.RouteEvent, handleRouteEvent);

    return () => eventEmitter.off(WidgetEvents.RouteEvent, handleRouteEvent);
  }, [eventEmitter]);
}
