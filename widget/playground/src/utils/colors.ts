import type { Mode } from '../store/config';
import type { ColorsType, PresetType } from '../types';
import type { WidgetColorsKeys } from '@arlert-dev/widget-embedded';

import { shallowEqual } from './common';

export const getMainColor = (
  key: WidgetColorsKeys,
  tab: Mode,
  theme?: {
    singleTheme?: boolean;
    colors?: ColorsType;
    mode?: 'light' | 'dark';
  }
): string | undefined => {
  const isDarkTab = tab === 'dark';
  const isLightTab = tab === 'light';
  const isAutoTab = tab === 'auto';

  if (!!theme?.colors) {
    if (isAutoTab && !theme.singleTheme) {
      return (theme?.colors[theme?.mode || 'light'] || {})[key];
    }
    if (isDarkTab && theme?.singleTheme && theme?.colors?.dark) {
      return theme?.colors?.dark[key];
    }
    if (isLightTab && theme?.singleTheme && theme?.colors?.light) {
      return theme?.colors?.light[key];
    }
  }
  return undefined;
};

export const isPresetSelected = (
  preset: ColorsType,
  selectedPreset: ColorsType,
  mode: Mode
): boolean => {
  const { dark: selectedDarkColors = {}, light: selectedLightColors = {} } =
    preset;
  const { dark: presetDarkColors = {}, light: presetLightColors = {} } =
    selectedPreset;

  const isDarkEqual = shallowEqual(selectedDarkColors, presetDarkColors);
  const isLightEqual = shallowEqual(selectedLightColors, presetLightColors);

  switch (mode) {
    case 'auto':
      return isDarkEqual && isLightEqual;
    case 'dark':
      return (
        isDarkEqual &&
        (Object.keys(presetLightColors).length === 0 || !isLightEqual)
      );

    case 'light':
      return (
        isLightEqual &&
        (Object.keys(presetDarkColors).length === 0 || !isDarkEqual)
      );

    default:
      return false;
  }
};

export const removeDuplicatePresets = (presets: PresetType) => {
  return presets.filter((preset, index, self) => {
    return (
      index ===
      self.findIndex(
        (p) =>
          shallowEqual(p.dark || {}, preset.dark || {}) ||
          shallowEqual(p.light || {}, preset.light || {})
      )
    );
  });
};
