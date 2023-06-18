import { useEffect } from 'react';
import { useEvents, MainEvents } from '@rango-dev/queue-manager-rango-preset';
import { useWalletsStore } from '../store/wallets';

export function WidgetEvents() {
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const getOneOfWalletsDetails = useWalletsStore.use.getOneOfWalletsDetails();

  const widgetEvents = useEvents();

  useEffect(() => {
    widgetEvents.on(MainEvents.StepEvent, (widgetEvent) => {
      const { event, step } = widgetEvent;
      if (
        (event.eventType === 'tx_sent' && !event.isApprovalTx) ||
        event.eventType === 'succeeded'
      ) {
        const fromAccount = connectedWallets.find(
          (account) => account.chain === step?.fromBlockchain,
        );
        const toAccount =
          step?.fromBlockchain !== step?.toBlockchain &&
          connectedWallets.find((wallet) => wallet.chain === step?.toBlockchain);

        fromAccount && getOneOfWalletsDetails(fromAccount);
        toAccount && getOneOfWalletsDetails(toAccount);
      }
    });

    return () => widgetEvents.all.clear();
  }, [widgetEvents, connectedWallets.length]);

  return null;
}
