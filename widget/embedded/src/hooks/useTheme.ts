import { createTheme } from '@rango-dev/ui';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { WidgetTheme } from '../types';
import { GenerateRangeColors } from '../utils/common';
import usePrevious from './usePrevious';

export function useTheme({
  colors: themeColors,
  fontFamily = 'Robot',
  borderRadius = 8,
  mode = 'auto',
}: WidgetTheme) {
  const theme = useSettingsStore.use.theme();
  const fetchMeta = useMetaStore.use.fetchMeta();
  const setTheme = useSettingsStore.use.setTheme();
  const light = themeColors?.light;
  const dark = themeColors?.dark;
  const neutrals = light?.neutrals || '#fafafa';
  const background = light?.background || '#fff';
  const foreground = light?.foreground || '#000';

  const darkColors = {
    ...GenerateRangeColors(dark?.primary, 'primary', 'dark'),
    ...GenerateRangeColors(dark?.error, 'error', 'dark'),
    ...GenerateRangeColors(dark?.warning, 'warning', 'dark'),
    ...GenerateRangeColors(dark?.success, 'success', 'dark'),
    ...GenerateRangeColors(dark?.neutrals, 'neutrals', 'dark'),
    surface: dark?.surface,
    background: dark?.background,
    foreground: dark?.foreground,
  };

  const lightColors = {
    surface: light?.surface || '#fff',
    ...GenerateRangeColors(light?.primary || '#5FA425', 'primary', 'light'),
    ...GenerateRangeColors(light?.error || '#FF0000', 'error', 'light'),
    ...GenerateRangeColors(light?.warning || '#F5A623', 'warning', 'light'),
    ...GenerateRangeColors(light?.success || '#0070F3', 'success', 'light'),
    ...GenerateRangeColors(neutrals, 'neutrals', 'light'),
    background,
    foreground,
  };

  const customeLightTheme = createTheme({
    colors: lightColors,
    radii: {
      5: `${borderRadius}px`,
    },
    shadows: {
      s: '0px 3px 5px 3px #f0f2f5, 0px 6px 10px 3px #f0f2f5, 0px 1px 18px 3px #f0f2f5',
    },
  });

  const customeDarkTheme = createTheme({
    colors: {
      ...lightColors,
      ...GenerateRangeColors('#111111', 'neutrals', 'dark'),
      foreground: background,
      background: foreground,
      surface: '#000',
      ...JSON.parse(JSON.stringify(darkColors)),
    },
    radii: {
      5: `${borderRadius}px`,
    },
    shadows: {
      s: '0px 3px 5px 3px #222, 0px 6px 10px 3px #222, 0px 1px 18px 3px #222',
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
    if (theme === 'auto') return OSTheme;
    else return theme === 'dark' ? customeDarkTheme : customeLightTheme;
  };

  return { activeTheme: getActiveTheme() };
}
