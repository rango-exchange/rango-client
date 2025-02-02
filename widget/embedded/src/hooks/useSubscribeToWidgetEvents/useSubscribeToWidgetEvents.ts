import type { RouteEventData, StepEventData } from '../..';

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
  const { connectedWallets, fetchBalances } = useAppStore();

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

        if (fromAccount) {
          void fetchBalances([fromAccount]);
        }
        if (toAccount) {
          void fetchBalances([toAccount]);
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
