import React, { useEffect, useState } from 'react';

import { RippleContainer } from './Button.styles';

const DURATION = 850;

const useDebouncedRippleCleanUp = (
  rippleCount: number,
  duration: number,
  cleanUpFunction: () => void
) => {
  useEffect(() => {
    let bounce: ReturnType<typeof setTimeout> | null = null;
    if (rippleCount > 0) {
      if (bounce) {
        clearTimeout(bounce);
      }

      bounce = setTimeout(() => {
        cleanUpFunction();
        if (bounce) {
          clearTimeout(bounce);
        }
      }, duration);
    }

    return () => {
      if (bounce) {
        clearTimeout(bounce);
      }
    };
  }, [rippleCount, duration, cleanUpFunction]);
};

const Ripple = ({ duration = DURATION }: { duration?: number }) => {
  const [rippleArray, setRippleArray] = useState<
    { x: number; y: number; size: number }[]
  >([]);

  useDebouncedRippleCleanUp(rippleArray.length, duration, () => {
    setRippleArray([]);
  });

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width
        : rippleContainer.height;
    const x = event.pageX - rippleContainer.x - size / 2;
    const y = event.pageY - rippleContainer.y - size / 2;
    const newRipple = {
      x,
      y,
      size,
    };

    setRippleArray([...rippleArray, newRipple]);
  };

  return (
    <RippleContainer onMouseDown={addRipple}>
      {rippleArray.length > 0 &&
        rippleArray.map((ripple, index) => {
          const key = 'span' + index;
          return (
            <span
              key={key}
              style={{
                top: ripple.y,
                left: ripple.x,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          );
        })}
    </RippleContainer>
  );
};

export default Ripple;
