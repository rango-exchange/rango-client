import type { Notification } from '../types/notification';

import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../constants/navigationRoutes';
import { useNotificationStore } from '../store/notification';
import { useUiStore } from '../store/ui';

export function useNotifications() {
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const { getUnreadNotifications } = useNotificationStore();
  const navigate = useNavigate();
  const notifications: Notification[] = getUnreadNotifications();
  const onSelect = (requestId: Notification['requestId']) => {
    setSelectedSwap(requestId);
    navigate(`${navigationRoutes.swaps}/${requestId}`);
  };

  return { onSelect, notifications };
}
