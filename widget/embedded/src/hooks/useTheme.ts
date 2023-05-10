import { createTheme } from '@rango-dev/ui';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { WidgetTheme } from '../types';
import { shadeColor } from '../utils/common';
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

  const primary = themeColors?.primary || '#5FA425',
    background = themeColors?.background || '#fff',
    foreground = themeColors?.foreground || '#000',
    error = themeColors?.error || '#FF0000',
    warning = themeColors?.warning || '#F5A623',
    success = themeColors?.success || '#0070F3',
    surfaceBackground = themeColors?.surfaceBackground || '#ffffff',
    surfaceForeground = themeColors?.surfaceForeground || '#000000',
    neutrals = themeColors?.neutrals || '#FDFDFD';
  const colors = {
    neutrals200: neutrals,
    neutrals300: shadeColor(neutrals, -5),
    neutrals400: shadeColor(neutrals, -10),
    neutrals500: shadeColor(neutrals, -20),
    neutrals600: shadeColor(neutrals, -30),
    neutrals700: shadeColor(neutrals, -40),
    neutrals800: shadeColor(neutrals, -60),
    neutrals900: shadeColor(neutrals, -70),

    surfaceForeground,
    surfaceBackground,
    primary,
    primary100: shadeColor(primary, 15),
    primary200: shadeColor(primary, -10),
    primary300: shadeColor(primary, -15),
    primary400: shadeColor(primary, -20),
    primary500: shadeColor(primary, -25),
    primary600: shadeColor(primary, -30),
    primary700: shadeColor(primary, -35),
    primary800: shadeColor(primary, -40),
    primary900: shadeColor(primary, -45),
    background,
    foreground,
    error,
    error100: shadeColor(error, 50),
    error300: shadeColor(error, -10),
    error500: shadeColor(error, -20),
    error700: shadeColor(error, -30),
    warning,
    warning100: shadeColor(warning, 50),
    warning300: shadeColor(warning, -10),
    warning500: shadeColor(warning, -20),
    warning700: shadeColor(warning, -30),
    success,
    success100: shadeColor(success, 50),
    success300: shadeColor(success, -10),
    success500: shadeColor(success, -20),
    success700: shadeColor(success, -30),
  };

  const customeLightTheme = createTheme({
    colors,
    radii: {
      5: `${borderRadius}px`,
    },
    shadows: {
      s: '0px 3px 5px 3px #f0f2f5, 0px 6px 10px 3px #f0f2f5, 0px 1px 18px 3px #f0f2f5',
    },
  });

  const customeDarkTheme = createTheme({
    colors: {
      ...colors,
      neutrals900: neutrals,
      neutrals800: shadeColor(neutrals, -5),
      neutrals700: shadeColor(neutrals, -10),
      neutrals600: shadeColor(neutrals, -20),
      neutrals500: shadeColor(neutrals, -30),
      neutrals400: shadeColor(neutrals, -40),
      neutrals300: shadeColor(neutrals, -60),
      neutrals200: shadeColor(neutrals, -70),

      foreground: background,
      background: foreground,

      surfaceForeground: surfaceBackground,
      surfaceBackground: surfaceForeground,
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
