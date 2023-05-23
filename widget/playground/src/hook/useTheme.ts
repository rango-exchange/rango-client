import { generateRangeColors, createTheme } from '@rango-dev/ui';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useConfigStore } from '../store/config';
import { useMetaStore } from '../store/meta';

export function useTheme() {
  const { colors, mode } = useConfigStore.use.config().theme;

  const fetchMeta = useMetaStore.use.fetchMeta();
  const light = colors?.light;
  const dark = colors?.dark;
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

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setOSTheme('dark');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', switchTheme);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', switchTheme);
    };
  }, []);

  const getActiveTheme = () => {
    if (mode === 'auto') return OSTheme === 'dark' ? customDarkTheme : customLightTheme;
    else return mode === 'dark' ? customDarkTheme : customLightTheme;
  };

  useLayoutEffect(() => {
    const body = document.body;
    const classNames = body.getAttribute('class')?.split(' ');

    if (classNames?.length && classNames?.length > 1) {
      body.removeAttribute('class');
      const searchedClassName = classNames.find((c) => c.search('font') !== -1);
      if (searchedClassName) body.classList.add(searchedClassName);
    }
    if (mode === 'auto') {
      if (OSTheme === 'light') body.classList.add(customLightTheme);
      else body.classList.add(customDarkTheme);
    } else if (mode === 'dark') body.classList.add(customDarkTheme);
    else body.classList.add(customLightTheme);
  }, [mode, OSTheme, customLightTheme, customDarkTheme]);

  return { activeTheme: getActiveTheme() };
}
