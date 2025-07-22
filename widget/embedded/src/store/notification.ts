import type { Notification } from '../types/notification';

import {
  type PendingSwapWithQueueID,
  type Route,
  type RouteEvent,
  type StepEvent,
} from '@arlert-dev/queue-manager-rango-preset';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import createSelectors from './selectors';

export interface NotificationState {
  isSynced: boolean;
  notifications: Notification[];
  setNotification: (event: RouteEvent | StepEvent, route: Route) => void;
  removeNotification: (requestId: Notification['requestId']) => void;
  getNotifications: () => Notification[];
  syncNotifications: (swaps: PendingSwapWithQueueID[]) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = createSelectors(
  create<NotificationState>()(
    persist(
      subscribeWithSelector((set, get) => ({
        isSynced: false,
        notifications: [],
        setNotification: (event, route) => {
          const fromStep = route.steps[0];
          const toStep = route.steps[route.steps.length - 1];

          const notification: Notification = {
            event,
            creationTime: Date.now(),
            requestId: route.requestId,
            route: {
              creationTime: parseInt(route.creationTime),
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
        removeNotification: (requestId) => {
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) => notification.requestId !== requestId
            ),
          }));
        },
        getNotifications: () => {
          const { isSynced, notifications } = get();
          return isSynced
            ? notifications.sort((a, b) => {
                if (a.route.creationTime && !b.route.creationTime) {
                  return -1;
                }
                if (!a.route.creationTime && b.route.creationTime) {
                  return 1;
                }
                if (!a.route.creationTime && !b.route.creationTime) {
                  return b.creationTime - a.creationTime;
                }
                return b.route.creationTime - a.route.creationTime;
              })
            : [];
        },
        syncNotifications: (swaps) => {
          const { isSynced, notifications } = get();

          if (!isSynced) {
            const nextNotifications: Notification[] = [];
            notifications.forEach((notification) => {
              const swapExist = swaps.some(
                (swap) => swap.swap.requestId === notification.requestId
              );
              if (swapExist) {
                nextNotifications.push(notification);
              }
            });

            set({ isSynced: true, notifications: nextNotifications });
          }
        },
        clearNotifications: () => set({ notifications: [] }),
      })),

      {
        name: 'notification',
        skipHydration: true,
        partialize: ({ isSynced, ...otherProps }) => otherProps,
        version: 1,
        migrate: (persistedState, version) => {
          if (version === 0) {
            /**
             * Eliminate the persistence of read notifications,
             * and remove the "read" flag from other notifications to align with the current modifications in the notification store structure.
             */
            const oldNotifications = (
              persistedState as {
                notifications: (Notification & { read: boolean })[];
              }
            ).notifications;

            (persistedState as NotificationState).notifications =
              oldNotifications
                .filter(
                  (notification: Notification & { read: boolean }) =>
                    !notification.read
                )
                .map(({ read, ...otherProps }) => otherProps);
          }

          return persistedState as NotificationState;
        },
      }
    )
  )
);
