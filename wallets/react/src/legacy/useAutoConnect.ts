import type { ProviderProps } from './types.js';

import { useEffect, useRef } from 'react';

import { shouldTryAutoConnect } from './utils.js';

export function useAutoConnect(
  props: Pick<ProviderProps, 'allBlockChains' | 'autoConnect'> & {
    /**
     * A function to run autoConnect on instances
     */
    autoConnectHandler: () => void;
  }
) {
  const autoConnectInitiated = useRef(false);

  useEffect(() => {
    if (shouldTryAutoConnect(props) && !autoConnectInitiated.current) {
      autoConnectInitiated.current = true;
      props.autoConnectHandler();
    }
  }, [props.autoConnect, props.allBlockChains]);
}
