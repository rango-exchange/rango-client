/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  createTheme,
  darkTheme as defaultDarkTheme,
  lightTheme as defaultLightTheme,
} from '@rango-dev/ui';
import { useEffect, useState } from 'react';

import { useAppStore } from '../store/AppStore';
import { type WidgetTheme } from '../types';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_PRIMARY_RADIUS,
  DEFAULT_SECONDARY_RADIUS,
} from '../utils/configs';
import { customizedThemeTokens } from '../utils/ui';

export function useTheme(props: WidgetTheme) {
  const {
    colors,
    fontFamily = DEFAULT_FONT_FAMILY,
    borderRadius = DEFAULT_PRIMARY_RADIUS,
    secondaryBorderRadius = DEFAULT_SECONDARY_RADIUS,
    mode = 'auto',
  } = props;

  const [OSTheme, setOSTheme] = useState('light');

  const { setTheme, theme } = useAppStore();

  const { dark, light } = customizedThemeTokens(colors);

  const baseTheme = createTheme({
    radii: {
      primary: `${borderRadius}px`,
      secondary: `${secondaryBorderRadius}px`,
    },
    fonts: {
      widget: fontFamily,
    },
  });
  const lightThemeClasses = [baseTheme.className, defaultLightTheme.className];
  const darkThemeClasses = [baseTheme.className, defaultDarkTheme.className];

  /*
   * If theme has been customized, we will push the customized theme to override the default themes.
   * To be overridden, it should be last thing that has been pushed.
   */
  if (light) {
    const customizedLightTheme = createTheme(light.id, light.tokens);
    lightThemeClasses.push(customizedLightTheme.className);
  }
  if (dark) {
    const customizedDarkTheme = createTheme(dark.id, dark.tokens);
    darkThemeClasses.push(customizedDarkTheme.className);
  }

  useEffect(() => {
    const switchThemeListener = (event: MediaQueryListEvent) => {
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
      .addEventListener('change', switchThemeListener);
    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', switchThemeListener);
    };
  }, []);

  useEffect(() => {
    if (mode !== 'auto') {
      setTheme(mode);
    }
  }, [mode]);

  const getActiveTheme = () => {
    const lightClassNames = lightThemeClasses.join(' ');
    const darkClassNames = darkThemeClasses.join(' ');
    if (theme === 'auto') {
      return OSTheme === 'dark' ? darkClassNames : lightClassNames;
    }
    return theme === 'dark' ? darkClassNames : lightClassNames;
  };

  return { activeTheme: getActiveTheme };
}
