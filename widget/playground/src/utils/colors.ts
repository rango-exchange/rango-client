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
    const lengthOfDarkThemes = Object.keys(theme?.colors?.dark).length;
    const lengthOfLightThemes = Object.keys(theme?.colors?.light).length;

    const isDarkColorsOnly = !!lengthOfDarkThemes && !lengthOfLightThemes;
    const isLightColorsOnly = !!lengthOfLightThemes && !lengthOfDarkThemes;
    const isLightAndDarkColors = !!lengthOfLightThemes && !!lengthOfDarkThemes;

    if (isAutoTab && isLightAndDarkColors) {
      return theme?.colors[mode || 'light'][key];
    }
    if (isDarkTab && isDarkColorsOnly) {
      return theme?.colors?.dark[key];
    }
    if (isLightTab && isLightColorsOnly) {
      return theme?.colors?.light[key];
    }
  }
  return undefined;
};
