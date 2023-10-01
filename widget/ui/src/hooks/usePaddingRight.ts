import { useEffect } from 'react';

type Params = {
  element: HTMLElement | null;
  paddingRight: string;
};

/*
 * This hook employs ResizeObserver to prevent layout shift when the content of the layout overflows.
 * By implementing this solution, we ensure that there is a constant padding on the right side of the content, regardless of whether or not a scrollbar is present.
 */
export function usePaddingRight(params: Params) {
  const { element, paddingRight } = params;
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (element) {
      resizeObserver = new ResizeObserver(() => {
        if (element) {
          const scrollable = element.scrollHeight > element.clientHeight;
          if (scrollable) {
            element.style.paddingRight = `${
              parseInt(paddingRight) -
              (element.offsetWidth - element.clientWidth)
            }px`;
          } else {
            element.style.paddingRight = paddingRight;
          }
        }
      });
      resizeObserver.observe(element);
    }
    return () => {
      if (element) {
        resizeObserver?.unobserve(element);
      }
    };
  }, [element]);
}
