import type { RouteEventData, StepEventData } from '../..';

import {
  isApprovalTX,
  MainEvents,
  RouteEventType,
  StepEventType,
  StepExecutionEventStatus,
  useEvents,
} from '@rango-dev/queue-manager-rango-preset';
import { useEffect } from 'react';

import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { useWalletsStore } from '../../store/wallets';

export function useSubscribeToWidgetEvents() {
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const getWalletsDetails = useWalletsStore.use.getWalletsDetails();
  const setNotification = useNotificationStore.use.setNotification();
  const { findToken } = useAppStore();
  const widgetEvents = useEvents();

  useEffect(() => {
    const handleStepEvent = (widgetEvent: StepEventData) => {
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

        fromAccount && getWalletsDetails([fromAccount], findToken);
        toAccount && getWalletsDetails([toAccount], findToken);
      }

      setNotification(event, route);
    };
    widgetEvents.on(MainEvents.StepEvent, handleStepEvent);

    return () => widgetEvents.off(MainEvents.StepEvent, handleStepEvent);
  }, [widgetEvents, connectedWallets.length]);

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
    widgetEvents.on(MainEvents.RouteEvent, handleRouteEvent);

    return () => widgetEvents.off(MainEvents.RouteEvent, handleRouteEvent);
  }, [widgetEvents, connectedWallets.length]);
}
