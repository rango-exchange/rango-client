import { useLocation } from 'react-router-dom';

export function useSwapMode() {
  const location = useLocation();

  return location.pathname.startsWith('/refuel') ? 'refuel' : 'swap';
}
