import type { Messages } from './useIframe.types';

import { useRef } from 'react';

import { useAppStore } from '../../store/AppStore';

import { isAppLoadedIntoIframe } from './useIframe.helpers';

interface UseIframe {
  send: (message: Messages) => void;
  connectHeightObserver: (element: HTMLElement) => void;
  disconnectHeightObserver: () => void;
}

function useIframe(): UseIframe {
  const heightObserver = useRef<ResizeObserver | null>(null);
  const { iframe } = useAppStore();
  const isMessagePassingAvailable = isAppLoadedIntoIframe() && iframe.clientUrl;

  const send = (message: Messages) => {
    if (isMessagePassingAvailable) {
      window.top?.postMessage(message, iframe.clientUrl!);
    }
  };

  const connectHeightObserver = (element: HTMLElement) => {
    heightObserver.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        send({
          type: 'widget_height',
          data: {
            height: entry.contentRect.height,
          },
        });
      }
    });

    heightObserver.current.observe(element);
  };

  const disconnectHeightObserver = () => {
    if (heightObserver.current) {
      heightObserver.current.disconnect();
      heightObserver.current = null;
    }
  };

  return {
    send,
    connectHeightObserver,
    disconnectHeightObserver,
  };
}

export { useIframe };
