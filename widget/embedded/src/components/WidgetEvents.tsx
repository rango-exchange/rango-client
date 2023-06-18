import { useEffect } from 'react';
import {
  useEvents,
  MainEvents,
  StepEventType,
  TX_EXECUTION,
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
        event.eventType === StepEventType.TX_EXECUTION &&
        (event.type === TX_EXECUTION.TX_SENT ||
          event.type === TX_EXECUTION.SUCCEEDED);

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
