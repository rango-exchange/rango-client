import { createTheme, generateRangeColors } from '@rango-dev/ui';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { WidgetTheme } from '../types';
import usePrevious from './usePrevious';

export function useTheme({
  colors: themeColors,
  fontFamily = 'Roboto',
  borderRadius = 8,
  mode = 'auto',
}: WidgetTheme) {
  const theme = useSettingsStore.use.theme();
  const fetchMeta = useMetaStore.use.fetchMeta();
  const setTheme = useSettingsStore.use.setTheme();
  const light = themeColors?.light;
  const dark = themeColors?.dark;
  const neutral = light?.neutral || '#fafafa';
  const background = light?.background || '#fff';
  const foreground = light?.foreground || '#000';

  const darkColors = {
    ...generateRangeColors('primary', 'dark', dark?.primary),
    ...generateRangeColors('error', 'dark', dark?.error),
    ...generateRangeColors('warning', 'dark', dark?.warning),
    ...generateRangeColors('success', 'dark', dark?.success),
    ...generateRangeColors('neutral', 'dark', dark?.neutral),
    surface: dark?.surface,
    background: dark?.background,
    foreground: dark?.foreground,
  };

  const lightColors = {
    surface: light?.surface || '#fff',
    ...generateRangeColors('primary', 'light', light?.primary || '#5FA425'),
    ...generateRangeColors('error', 'light', light?.error || '#FF0000'),
    ...generateRangeColors('warning', 'light', light?.warning || '#F5A623'),
    ...generateRangeColors('success', 'light', light?.success || '#0070F3'),
    ...generateRangeColors('neutral', 'light', neutral),
    background,
    foreground,
  };

  const customLightTheme = createTheme({
    colors: lightColors,
    radii: {
      5: `${borderRadius}px`,
    },
    shadows: {
      s: `0px 3px 5px 3px ${light?.neutral || '#f0f2f5'} ,0px 6px 10px 3px ${
        light?.neutral || '#f0f2f5'
      }, 0px 1px 18px 3px ${light?.neutral || '#f0f2f5'}`,
    },
  });

  const customDarkTheme = createTheme({
    colors: {
      ...lightColors,
      ...generateRangeColors('neutral', 'dark', '#111111'),
      foreground: background,
      background: foreground,
      surface: '#000',
      ...JSON.parse(JSON.stringify(darkColors)),
    },
    radii: {
      5: `${borderRadius}px`,
    },
    shadows: {
      s: `0px 3px 5px 3px ${dark?.neutral || '#222'}, 0px 6px 10px 3px ${
        dark?.neutral || '#222'
      }, 0px 1px 18px 3px ${dark?.neutral || '#222'}`,
    },
  });
  const [OSTheme, setOSTheme] = useState('light');

  useEffect(() => {
    (async () => {
      await fetchMeta();
    })();

    const switchTheme = (event: MediaQueryListEvent) => {
      if (event.matches) setOSTheme('dark');
      else setOSTheme('light');
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
    if (mode !== 'auto') setTheme(mode);
  }, [mode]);
  const prevFont = usePrevious(fontFamily);

  useLayoutEffect(() => {
    const { classList } = document.body;

    if (prevFont) classList.remove(`font_${prevFont.replace(/ /g, '')}`);
    classList.add(`font_${fontFamily.replace(/ /g, '')}`);
  }, [fontFamily]);

  const getActiveTheme = () => {
    if (theme === 'auto')
      return OSTheme === 'dark' ? customDarkTheme : customLightTheme;
    else return theme === 'dark' ? customDarkTheme : customLightTheme;
  };

  return { activeTheme: getActiveTheme() };
}
