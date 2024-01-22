import { RefreshProgressButton } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { HeaderButton, ProgressIcon } from './HeaderButtons.styles';

const REFRESH_INTERVAL = 1000;
const MAX_ELAPSED_TIME = 60;
const MAX_PERCENTAGE = 100;

function RefreshButton({ onClick }: { onClick: (() => void) | undefined }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRefetched, setIsRefetched] = useState(false);

  const handleVisibilityChange = (interval?: number) => {
    if (document.hidden && interval) {
      // Tab is inactive, clear the interval
      clearTimeout(interval);
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    if (onClick) {
      interval = window.setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);

        if (elapsedTime === MAX_ELAPSED_TIME) {
          handleRefreshClick();
        }
      }, REFRESH_INTERVAL);
    } else {
      clearTimeout(interval);
    }

    document.addEventListener('visibilitychange', () =>
      handleVisibilityChange(interval)
    );

    return () => {
      document.removeEventListener('visibilitychange', () =>
        handleVisibilityChange(interval)
      );
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [elapsedTime, onClick]);

  const clearTimeout = (interval?: number) => {
    if (interval) {
      clearInterval(interval);
    }
    setElapsedTime(0);
  };

  const handleRefreshClick = () => {
    onClick?.();
    setElapsedTime(0);
    setIsRefetched(true);
  };

  return (
    <HeaderButton
      variant="ghost"
      size="small"
      onClick={handleRefreshClick}
      disabled={!onClick}>
      <ProgressIcon
        onTransitionEnd={() => setIsRefetched(false)}
        isRefetched={isRefetched}>
        <RefreshProgressButton
          size={24}
          color={!onClick ? 'gray' : 'black'}
          progress={(elapsedTime / MAX_ELAPSED_TIME) * MAX_PERCENTAGE}
        />
      </ProgressIcon>
    </HeaderButton>
  );
}

export { RefreshButton };
