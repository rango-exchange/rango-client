import { createTheme, theme } from '@rango-dev/ui';
import { useEffect, useLayoutEffect, useState } from 'react';

import { NOT_FOUND } from '../helpers';
import { useConfigStore } from '../store/config';
import { useMetaStore } from '../store/meta';

export function useTheme() {
  const configTheme = useConfigStore.use.config().theme;
  const configColors = configTheme?.colors;
  const mode = configTheme?.mode;

  const fetchMeta = useMetaStore.use.fetchMeta();
  const light = configColors?.light;
  const dark = configColors?.dark;
  const colors = theme.colors;

  const customLightTheme = createTheme({
    colors,
    shadows: {
      s: `0px 3px 5px 3px ${light?.neutral || '#f0f2f5'} ,0px 6px 10px 3px ${
        light?.neutral || '#f0f2f5'
      }, 0px 1px 18px 3px ${light?.neutral || '#f0f2f5'}`,
    },
  });

  const customDarkTheme = createTheme({
    colors,
    shadows: {
      s: `0px 3px 5px 3px ${dark?.neutral || '#222'}, 0px 6px 10px 3px ${
        dark?.neutral || '#222'
      }, 0px 1px 18px 3px ${dark?.neutral || '#222'}`,
    },
  });
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
