import {
  isApprovalTX,
  MainEvents,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  useEvents,
} from '@rango-dev/queue-manager-rango-preset';
import { useEffect } from 'react';

import { useNotificationStore } from '../store/notification';
import { useWalletsStore } from '../store/wallets';
import { validBlockedStatuses } from '../types/notification';

export function WidgetEvents() {
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

        fromAccount && getWalletsDetails([fromAccount]);
        toAccount && getWalletsDetails([toAccount]);
      }
      if (
        event.type === StepEventType.TX_EXECUTION_BLOCKED &&
        validBlockedStatuses.includes(event.status)
      ) {
        setNotification(event, route);
      }
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
