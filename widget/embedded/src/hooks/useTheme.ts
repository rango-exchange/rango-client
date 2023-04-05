import { createTheme } from '@rango-dev/ui';
import { useState, useEffect } from 'react';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { Colors } from '../types';
import { shadeColor } from '../utils/common';

export function useTheme({
  primary = '#5FA425',
  background = '#fff',
  foreground = '#000',
  error = '#FF0000',
  warning = '#F5A623',
  success = '#0070F3',
  borderRadius = 5,
}: Colors & { borderRadius?: number }) {
  const theme = useSettingsStore.use.theme();
  const fetchMeta = useMetaStore.use.fetchMeta();
  const colors = {
    neutrals200: '#FAFAFA',
    neutrals300: '#EAEAEA',
    neutrals400: '#999999',
    neutrals500: '#888888',
    neutrals600: '#666666',
    neutrals700: '#444444',
    neutrals800: '#333333',
    neutrals900: '#111111',
    primary,
    primary100: shadeColor(primary, 10),
    primary200: shadeColor(primary, 20),
    primary300: shadeColor(primary, 30),
    primary400: shadeColor(primary, 40),
    primary500: shadeColor(primary, 50),
    primary600: shadeColor(primary, 60),
    primary700: shadeColor(primary, 70),
    primary800: shadeColor(primary, 80),
    primary900: shadeColor(primary, 90),
    background,
    foreground,
    error,
    error100: shadeColor(error, 10),
    error300: shadeColor(error, 30),
    error500: shadeColor(error, 50),
    error700: shadeColor(error, 70),
    warning,
    warning100: shadeColor(warning, 10),
    warning300: shadeColor(warning, 30),
    warning500: shadeColor(warning, 50),
    warning700: shadeColor(warning, 70),
    success,
    success100: shadeColor(success, 10),
    success300: shadeColor(success, 30),
    success500: shadeColor(success, 50),
    success700: shadeColor(success, 70),
  };

  const customeLightTheme = createTheme({
    colors,
    radii: {
      5: `${borderRadius}px`,
    },
  });

  const customeDarkTheme = createTheme({
    colors: {
      ...colors,
      neutrals200: '#111111',
      neutrals300: '#333333',
      neutrals400: '#444444',
      neutrals500: '#666666',
      neutrals600: '#888888',
      neutrals700: '#999999',
      neutrals800: '#EAEAEA',
      neutrals900: '#FAFAFA',
      foreground: background,
      background: foreground,
    },
    radii: {
      5: `${borderRadius}px`,
    },
  });
  const [OSTheme, setOSTheme] = useState(customeLightTheme);
  useEffect(() => {
    (async () => {
      await fetchMeta();
    })();

    const switchTheme = (event: MediaQueryListEvent) => {
      if (event.matches) setOSTheme(customeDarkTheme);
      else setOSTheme(customeLightTheme);
    };

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setOSTheme(customeDarkTheme);
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

  const getActiveTheme = () => {
    if (theme === 'auto') return OSTheme;
    else return theme === 'dark' ? customeDarkTheme : customeLightTheme;
  };

  return { activeTheme: getActiveTheme() };
}
