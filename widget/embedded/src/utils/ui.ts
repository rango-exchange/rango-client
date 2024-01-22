/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { WidgetTheme } from '../types';
import type { createTheme } from '@rango-dev/ui';
import type React from 'react';

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
    true,
    colors?.dark
  );
  const lightColorsWithDefaults = generateColors(
    baseColors,
    false,
    colors?.light
  );
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
      colors: darkColorsWithDefaults,
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

export function joinList(
  list: React.JSX.Element[],
  divider: React.JSX.Element
) {
  if (list.length <= 1) {
    return list;
  }

  const output: React.JSX.Element[] = [];
  list.forEach((item, index) => {
    output.push(item);
    if (index < list.length - 1) {
      output.push(divider);
    }
  });

  return output;
}
