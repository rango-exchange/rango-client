import { createTheme, theme } from '@rango-dev/ui';
import { useEffect, useLayoutEffect, useState } from 'react';

import { NOT_FOUND } from '../constants';
import { useConfigStore } from '../store/config';

export function useTheme() {
  const configTheme = useConfigStore.use.config().theme;
  const mode = configTheme?.mode;

  const colors = theme.colors;

  const customLightTheme = createTheme('light-theme-playground', {
    colors,
  });

  const customDarkTheme = createTheme('dark-theme-playground', {
    colors,
  });

  const [OSTheme, setOSTheme] = useState('light');

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

  const getActiveTheme = () => {
    if (mode === 'auto') {
      return OSTheme === 'dark' ? customDarkTheme : customLightTheme;
    }
    return mode === 'dark' ? customDarkTheme : customLightTheme;
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
    if (mode === 'auto') {
      if (OSTheme === 'light') {
        body.classList.add(customLightTheme);
      } else {
        body.classList.add(customDarkTheme);
      }
    } else if (mode === 'dark') {
      body.classList.add(customDarkTheme);
    } else {
      body.classList.add(customLightTheme);
    }
  }, [mode, OSTheme, customLightTheme, customDarkTheme]);

  return {
    activeStyle: getActiveTheme(),
    activeTheme: mode === 'auto' ? OSTheme : mode,
  };
}
