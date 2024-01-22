import {
  isApprovalTX,
  MainEvents,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  useEvents,
} from '@rango-dev/queue-manager-rango-preset';
import { useEffect } from 'react';

import { useAppStore } from '../store/AppStore';
import { useNotificationStore } from '../store/notification';
import { useWalletsStore } from '../store/wallets';

export function WidgetEvents() {
  const tokens = useAppStore().tokens();
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const getWalletsDetails = useWalletsStore.use.getWalletsDetails();
  const setNotification = useNotificationStore.use.setNotification();
  const widgetEvents = useEvents();

  useEffect(() => {
    widgetEvents.on(MainEvents.StepEvent, (widgetEvent) => {
      const { event, step, route } = widgetEvent;
      const shouldRefetchBalance =
        (event.type === StepEventType.TX_EXECUTION &&
          event.status === StepExecutionEventStatus.TX_SENT &&
          !isApprovalTX(step)) ||
        event.type === StepEventType.SUCCEEDED;

      if (shouldRefetchBalance) {
        const fromAccount = connectedWallets.find(
          (account) => account.chain === step?.fromBlockchain
        );
        const toAccount =
          step?.fromBlockchain !== step?.toBlockchain &&
          connectedWallets.find(
            (wallet) => wallet.chain === step?.toBlockchain
          );

        fromAccount && getWalletsDetails([fromAccount], tokens);
        toAccount && getWalletsDetails([toAccount], tokens);
      }

      setNotification(event, route);
    });

    return () => widgetEvents.all.clear();
  }, [widgetEvents, connectedWallets.length]);

  useEffect(() => {
    widgetEvents.on(MainEvents.RouteEvent, (widgetEvent) => {
      const { event, route } = widgetEvent;

      if (
        event.type === RouteEventType.FAILED ||
        event.type === RouteEventType.SUCCEEDED
      ) {
        setNotification(event, route);
      }
    });

    return () => widgetEvents.all.clear();
  }, [widgetEvents, connectedWallets.length]);

  return null;
}
