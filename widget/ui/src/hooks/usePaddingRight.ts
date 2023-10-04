import type { MutableRefObject } from 'react';

import { useLayoutEffect } from 'react';

type Params = {
  elementRef: MutableRefObject<HTMLElement | null>;
  paddingRight: string;
};

/*
 * This hook employs ResizeObserver to prevent layout shift when the content of the layout overflows.
 * By implementing this solution, we ensure that there is a constant padding on the right side of the content, regardless of whether or not a scrollbar is present.
 */
export function usePaddingRight(params: Params) {
  const { elementRef, paddingRight } = params;
  useLayoutEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (elementRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (elementRef.current) {
          const scrollable =
            elementRef.current.scrollHeight > elementRef.current.clientHeight;
          if (scrollable) {
            elementRef.current.style.paddingRight = `${
              parseInt(paddingRight) -
              (elementRef.current.offsetWidth - elementRef.current.clientWidth)
            }px`;
          } else {
            elementRef.current.style.paddingRight = paddingRight;
          }
        }
      });
      resizeObserver.observe(elementRef.current);
    }
    return () => {
      if (elementRef.current) {
        resizeObserver?.unobserve(elementRef.current);
      }
    };
  }, [elementRef.current]);
}
