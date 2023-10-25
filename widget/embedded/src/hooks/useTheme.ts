import type { WidgetTheme } from '../types';

import {
  createTheme,
  darkTheme,
  lightTheme,
  darkColors as mainDarkColors,
  theme as mainTheme,
} from '@rango-dev/ui';
import { useEffect, useState } from 'react';

import { DEFAULT_FONT_FAMILY } from '../constants/fonts';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { generateColors } from '../utils/colors';
import {
  DEFAULT_PRIMARY_RADIUS,
  DEFAULT_SECONDARY_RADIUS,
} from '../utils/configs';

export function useTheme(props: WidgetTheme) {
  const {
    colors,
    fontFamily = DEFAULT_FONT_FAMILY,
    borderRadius = DEFAULT_PRIMARY_RADIUS,
    secondaryBorderRadius = DEFAULT_SECONDARY_RADIUS,
    mode = 'auto',
  } = props;
  const theme = useSettingsStore.use.theme();
  const mainColors = mainTheme.colors;

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

  const darkColors = generateColors(
    {
      ...mainColors,
      ...mainDarkColors,
    },
    colors?.dark
  );
  const lightColors = generateColors(mainColors, colors?.light);
  const customLightTheme = Object.keys(lightColors).length
    ? createTheme({
        colors: lightColors,
      })
    : lightTheme;
  const customDarkTheme = Object.keys(darkColors).length
    ? createTheme({
        colors: {
          ...darkColors,
          neutral100: darkColors.neutral900,
          neutral200: darkColors.neutral800,
          neutral300: darkColors.neutral700,
          neutral400: darkColors.neutral600,
          neutral500: darkColors.neutral500,
          neutral600: darkColors.neutral400,
          neutral700: darkColors.neutral300,
          neutral800: darkColors.neutral200,
          neutral900: darkColors.neutral100,
        },
      })
    : darkTheme;

  const lightClassName = `${customTheme.className} ${customLightTheme.className}`;
  const darkClassName = `${customTheme.className} ${customDarkTheme.className}`;

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
