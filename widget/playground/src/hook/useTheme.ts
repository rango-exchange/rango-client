import { lightTheme, darkTheme } from '@rango-dev/ui';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useConfigStore } from '../store/config';
import { useMetaStore } from '../store/meta';

export function useTheme() {
  const mode = useConfigStore.use.config().theme.mode;
  const fetchMeta = useMetaStore.use.fetchMeta();
  const [OSTheme, setOSTheme] = useState(lightTheme);
  useEffect(() => {
    (async () => {
      await fetchMeta();
    })();

    const switchTheme = (event: MediaQueryListEvent) => {
      if (event.matches) setOSTheme(darkTheme);
      else setOSTheme(lightTheme);
    };

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setOSTheme(darkTheme);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', switchTheme);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', switchTheme);
    };
  }, []);

  const getActiveTheme = () => {
    if (mode === 'auto') return OSTheme;
    else return mode === 'dark' ? darkTheme : lightTheme;
  };

  useLayoutEffect(() => {
    const { classList } = document.body;
    if (mode === 'auto') classList.add(OSTheme);
    else if (mode === 'dark') classList.add(darkTheme);
    else classList.remove(darkTheme);
  }, [mode, OSTheme]);

  return { activeTheme: getActiveTheme() };
}
