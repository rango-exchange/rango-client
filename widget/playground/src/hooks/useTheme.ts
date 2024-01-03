import {
  createTheme,
  darkTheme as defaultDarkTheme,
  lightTheme as defaultLightTheme,
} from '@yeager-dev/ui';
import { customizedThemeTokens } from '@yeager-dev/widget-embedded';
import { useEffect, useLayoutEffect, useState } from 'react';

import { NOT_FOUND } from '../constants';
import { useConfigStore } from '../store/config';

export function useTheme() {
  const [systemTheme, setSystemTheme] = useState('light');
  const configTheme = useConfigStore.use.config().theme;
  const mode = configTheme?.mode;

  const { dark, light } = customizedThemeTokens(configTheme?.colors);

  const lightThemeClasses = [defaultLightTheme.className];
  const darkThemeClasses = [defaultDarkTheme.className];

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
        setSystemTheme('dark');
      } else {
        setSystemTheme('light');
      }
    };

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setSystemTheme('dark');
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

  const getActiveTheme = () => {
    const lightClassNames = lightThemeClasses.join(' ');
    const darkClassNames = darkThemeClasses.join(' ');
    if (mode === 'auto') {
      return systemTheme === 'dark' ? darkClassNames : lightClassNames;
    }
    return mode === 'dark' ? darkClassNames : lightClassNames;
  };

  useLayoutEffect(() => {
    const body = document.body;
    const classNames = body.getAttribute('class')?.split(' ');

    if (classNames?.length && classNames?.length > 1) {
      body.removeAttribute('class');
      const searchedClassName = classNames.find(
        (c) => c.search('font') !== NOT_FOUND
      );
      if (searchedClassName) {
        body.classList.add(searchedClassName);
      }
    }
  }, [mode, systemTheme]);

  return {
    activeStyle: getActiveTheme(),
    activeTheme: mode === 'auto' ? systemTheme : mode,
  };
}
