import { useEffect, useState } from 'react';

export function useElementScrollable(element: HTMLElement | null) {
  const [elementScrollable, setElementScrollable] = useState(
    element ? element?.scrollHeight > element?.clientHeight : false
  );

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (element) {
      console.log({ element: element.scrollHeight, a: element.clientHeight });
      resizeObserver = new ResizeObserver(() => {
        setElementScrollable(element.scrollHeight > element.clientHeight);
      });
      resizeObserver.observe(element);
    }
    return () => {
      if (element) {
        resizeObserver?.unobserve(element);
      }
    };
  }, [element]);

  return elementScrollable;
}
