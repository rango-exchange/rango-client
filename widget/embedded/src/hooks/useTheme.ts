import type { WidgetTheme } from '../types';

import { createTheme, darkTheme, lightTheme } from '@rango-dev/ui';
import { useEffect, useState } from 'react';

import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import {
  DEFAULT_PRIMARY_RADIUS,
  DEFAULT_SECONDARY_RADIUS,
} from '../utils/configs';

export function useTheme({
  // colors,
  fontFamily = 'Roboto',
  borderRadius = DEFAULT_PRIMARY_RADIUS,
  secondaryBorderRadius = DEFAULT_SECONDARY_RADIUS,
  mode = 'auto',
}: WidgetTheme) {
  const theme = useSettingsStore.use.theme();
  const fetchMeta = useMetaStore.use.fetchMeta();
  const setTheme = useSettingsStore.use.setTheme();

  const customTheme = createTheme({
    radii: {
      primary: `${borderRadius}px`,
      secondary: `${secondaryBorderRadius}px`,
    },
    fonts: {
      widget: fontFamily,
    },
  });

  const lightClassName = `${customTheme.className} ${lightTheme.className}`;
  const darkClassName = `${customTheme.className} ${darkTheme.className}`;

  const [OSTheme, setOSTheme] = useState('light');

  useEffect(() => {
    const fetchData = async () => {
      await fetchMeta();
    };
    void fetchData();

    const switchTheme = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOSTheme('dark');
      } else {
        setOSTheme('light');
      }
    };

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setOSTheme('dark');
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', switchTheme);
    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', switchTheme);
    };
  }, []);
  useEffect(() => {
    if (mode !== 'auto') {
      setTheme(mode);
    }
  }, [mode]);

  const getActiveTheme = () => {
    if (theme === 'auto') {
      return OSTheme === 'dark' ? darkClassName : lightClassName;
    }
    return theme === 'dark' ? darkClassName : lightClassName;
  };

  return { activeTheme: getActiveTheme() };
}
