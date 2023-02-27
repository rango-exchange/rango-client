import { lightTheme, darkTheme } from '@rango-dev/ui';
import { useState, useEffect } from 'react';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';

export function useTheme() {
  const theme = useSettingsStore.use.theme();
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
    if (theme === 'auto') return OSTheme;
    else return theme === 'dark' ? darkTheme : lightTheme;
  };

  return { activeTheme: getActiveTheme() };
}
