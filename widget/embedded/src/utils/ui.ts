/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { WidgetTheme } from '../types';
import type { createTheme } from '@rango-dev/ui';

import {
  theme as baseThemeTokens,
  darkColors as defaultDarkColors,
} from '@rango-dev/ui';

import { generateColors } from '../utils/colors';
import { toHash } from '../utils/hash';

import { THEME_CLASS_NAME_PREFIX } from './configs';

interface CustomizedThemeValues {
  id: string;
  tokens: Parameters<typeof createTheme>[0];
}

interface CustomizedTheme {
  light: undefined | CustomizedThemeValues;
  dark: undefined | CustomizedThemeValues;
}

export function customizedThemeTokens(
  colors: WidgetTheme['colors']
): CustomizedTheme {
  const baseColors = baseThemeTokens.colors;

  const darkColorsWithDefaults = generateColors(
    {
      ...baseColors,
      ...defaultDarkColors,
    },
    colors?.dark
  );
  const lightColorsWithDefaults = generateColors(baseColors, colors?.light);
  const hasDefaultDarkColors = Object.keys(darkColorsWithDefaults).length > 0;
  const hasDefaultLightColors = Object.keys(lightColorsWithDefaults).length > 0;

  let light: CustomizedTheme['light'] = undefined;
  let dark: CustomizedTheme['dark'] = undefined;

  if (hasDefaultLightColors) {
    const tokens = { colors: lightColorsWithDefaults };
    const id = `${THEME_CLASS_NAME_PREFIX}-light-${toHash(tokens)}`;
    light = {
      id,
      tokens,
    };
  }
  if (hasDefaultDarkColors) {
    const tokens = {
      colors: {
        ...darkColorsWithDefaults,
        // Reverse the neutrals shade
        neutral100: darkColorsWithDefaults.neutral900,
        neutral200: darkColorsWithDefaults.neutral800,
        neutral300: darkColorsWithDefaults.neutral700,
        neutral400: darkColorsWithDefaults.neutral600,
        neutral500: darkColorsWithDefaults.neutral500,
        neutral600: darkColorsWithDefaults.neutral400,
        neutral700: darkColorsWithDefaults.neutral300,
        neutral800: darkColorsWithDefaults.neutral200,
        neutral900: darkColorsWithDefaults.neutral100,
      },
    };
    const id = `${THEME_CLASS_NAME_PREFIX}-dark-${toHash(tokens)}`;
    dark = {
      id,
      tokens,
    };
  }

  return {
    light,
    dark,
  };
}
