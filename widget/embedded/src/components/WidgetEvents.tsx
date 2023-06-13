import { useEffect } from 'react';
import {
  useEvents,
  MainEvents,
  StepEventTypes,
} from '@rango-dev/queue-manager-rango-preset';
import { useWalletsStore } from '../store/wallets';

export function WidgetEvents() {
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const getOneOfWalletsDetails = useWalletsStore.use.getOneOfWalletsDetails();

  const widgetEvents = useEvents();

  useEffect(() => {
    widgetEvents.on(MainEvents.StepEvent, (widgetEvent) => {
      const { event, step } = widgetEvent;
      const shouldRefetchBalance =
        (event.eventType === StepEventTypes.TX_SENT && !event.isApprovalTx) ||
        event.eventType === StepEventTypes.SUCCEEDED;

      if (shouldRefetchBalance) {
        const fromAccount = connectedWallets.find(
          (account) => account.chain === step?.fromBlockchain
        );
        const toAccount =
          step?.fromBlockchain !== step?.toBlockchain &&
          connectedWallets.find(
            (wallet) => wallet.chain === step?.toBlockchain
          );

        fromAccount && getOneOfWalletsDetails(fromAccount);
        toAccount && getOneOfWalletsDetails(toAccount);
      }
    });

    return () => widgetEvents.all.clear();
  }, [widgetEvents, connectedWallets.length]);

  return null;
}
