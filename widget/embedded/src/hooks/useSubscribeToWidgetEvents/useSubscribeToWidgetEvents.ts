import type { ConnectedWallet, RouteEventData, StepEventData } from '../..';
import type { Asset } from 'rango-types';

import {
  isApprovalTX,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  WidgetEvents,
} from '@rango-dev/queue-manager-rango-preset';
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
        // Define the from and to tokens involved in the step
        const fromToken: Asset = {
          blockchain: step.fromBlockchain,
          address: step.fromSymbol,
          symbol: step.fromSymbol,
        };
        const toToken: Asset = {
          blockchain: step.toBlockchain,
          address: step.toSymbol,
          symbol: step.toSymbol,
        };

        // Prepare arrays to store accounts requiring balance updates and custom tokens
        const accountForFetchBalances: ConnectedWallet[] = [];
        const customTokens: Asset[] = [];

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
            accountForFetchBalances.push(fromAccount);
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
              accountForFetchBalances.push(toAccount);
            }
          }
        }
        getCustomTokens().forEach((token) => {
          if (
            token.blockchain === fromToken.blockchain &&
            token.symbol === fromToken.symbol &&
            token.address === fromToken.address
          ) {
            customTokens.push(fromToken);
          }
          if (
            token.blockchain === toToken.blockchain &&
            token.symbol === toToken.symbol &&
            token.address === toToken.address
          ) {
            customTokens.push(toToken);
          }
        });

        // Fetch balances with minimal API requests
        void fetchBalances(accountForFetchBalances, { customTokens });
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
