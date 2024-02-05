import type { Notification } from '../types/notification';
import type {
  Route,
  RouteEvent,
  StepEvent,
} from '@rango-dev/queue-manager-rango-preset';

import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import createSelectors from './selectors';

export interface NotificationState {
  notifications: Notification[];
  setNotification: (event: RouteEvent | StepEvent, route: Route) => void;
  setAsRead: (requestId: Notification['requestId']) => void;
  getUnreadNotifications: () => Notification[];
}

export const useNotificationStore = createSelectors(
  create<NotificationState>()(
    persist(
      subscribeWithSelector((set, get) => ({
        notifications: [],
        setNotification: (event, route) => {
          const fromStep = route.steps[0];
          const toStep = route.steps[route.steps.length - 1];

          const notification: Notification = {
            event,
            creationTime: Date.now(),
            read: false,
            requestId: route.requestId,
            route: {
              from: {
                blockchain: fromStep.fromBlockchain,
                address: fromStep.fromSymbolAddress,
                symbol: fromStep.fromSymbol,
              },
              to: {
                blockchain: toStep.toBlockchain,
                address: toStep.toSymbolAddress,
                symbol: toStep.toSymbol,
              },
            },
          };

          const excludedList = get().notifications.filter(
            (notificationItem) => notificationItem.requestId !== route.requestId
          );

          set(() => ({
            notifications: [...excludedList, notification],
          }));
        },
        setAsRead: (requestId) => {
          set((state) => ({
            notifications: state.notifications.map((notificationItem) =>
              notificationItem.requestId === requestId
                ? { ...notificationItem, read: true }
                : notificationItem
            ),
          }));
        },
        getUnreadNotifications: () => {
          return get().notifications.filter(
            (notificationItem) => !notificationItem.read
          );
        },
      })),
      {
        name: 'notification',
        skipHydration: true,
      }
    )
  )
);
