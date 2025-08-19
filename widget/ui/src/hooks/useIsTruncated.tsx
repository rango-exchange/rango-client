import { type RefObject, useEffect, useState } from 'react';

export function useIsTruncated(
  content: React.ReactNode,
  ref: RefObject<HTMLElement>
): boolean {
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    console.log({ element });

    if (!element) {
      return;
    }
    console.log({ content });

    if (element.scrollWidth > element.clientWidth) {
      setIsTruncated(true);
    }
  }, [content, ref]);

  return isTruncated;
}
