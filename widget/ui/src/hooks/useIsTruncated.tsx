import { type RefObject, useEffect, useState } from 'react';

/*
 * This hook checks whether the text (or content) inside a React element fits within its width.
 * In other words, it determines if the content is truncated or fully visible.
 */

export function useIsTruncated(
  content: string,
  ref: RefObject<HTMLElement>
): boolean {
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    if (element.scrollWidth > element.clientWidth) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  }, [content]);

  return isTruncated;
}
