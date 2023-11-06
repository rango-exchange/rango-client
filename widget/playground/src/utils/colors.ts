import type { Mode } from '../store/config';
import type { WidgetColorsKeys, WidgetTheme } from '@rango-dev/widget-embedded';

export const getMainColor = (
  key: WidgetColorsKeys,
  tab: Mode,
  theme?: WidgetTheme,
  mode?: 'light' | 'dark'
): string | undefined => {
  const isDarkTab = tab === 'dark';
  const isLightTab = tab === 'light';
  const isAutoTab = tab === 'auto';
  if (!!theme?.colors) {
    if (isAutoTab && !theme.singleTheme) {
      return (theme?.colors[mode || 'light'] || {})[key];
    }
    if (isDarkTab && theme.singleTheme && theme?.colors?.dark) {
      return theme?.colors?.dark[key];
    }
    if (isLightTab && theme.singleTheme && theme?.colors?.light) {
      return theme?.colors?.light[key];
    }
  }
  return undefined;
};
