import { RefreshProgressButton } from '@rango-dev/ui';
import React, { useEffect, useRef, useState } from 'react';

import { HeaderButton, ProgressIcon } from './HeaderButtons.styles';

const PROGRESS_DURATION = 60;

function RefreshButton({ onClick }: { onClick: (() => void) | undefined }) {
  const isDisabled = !onClick;
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [isPaused, setIsPaused] = useState(isDisabled);
  const ref = useRef<HTMLButtonElement>(null);

  const handleVisibilityChange = () => {
    setIsPaused(document.hidden || isDisabled);
  };

  useEffect(() => {
    setIsPaused(isDisabled);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onClick]);

  const handleRefreshClick = () => {
    onClick?.();
    setIsPaused(true);
    setIsRefreshed(true);
  };

  const handleRefreshComplete = () => {
    setIsPaused(false);
    setIsRefreshed(false);
  };

  return (
    <HeaderButton
      variant="ghost"
      ref={ref}
      size="small"
      style={{ paddingTop: 0, paddingBottom: 0 }}
      onClick={handleRefreshClick}
      disabled={isDisabled}>
      <ProgressIcon
        onTransitionEnd={handleRefreshComplete}
        isRefreshed={isRefreshed}>
        <RefreshProgressButton
          size={24}
          color={!onClick ? 'gray' : 'black'}
          isPaused={isPaused}
          onProgressEnd={() => ref?.current?.click()}
          progressDuration={PROGRESS_DURATION}
        />
      </ProgressIcon>
    </HeaderButton>
  );
}

export { RefreshButton };
