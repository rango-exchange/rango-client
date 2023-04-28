import React from 'react';
import copy from 'copy-to-clipboard';

export function useCopyToClipboard(resetInterval?: number) {
  const [isCopied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback((text: string | number) => {
    copy(text.toString());
    setCopied(true);
  }, []);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCopied && resetInterval) {
      timeout = setTimeout(() => setCopied(false), resetInterval);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied, resetInterval]);

  return [isCopied, handleCopy] as const;
}
