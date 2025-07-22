/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { WidgetTheme } from '../types';
import type { createTheme } from '@arlert-dev/ui';

import {
  theme as baseThemeTokens,
  darkColors as defaultDarkColors,
} from '@arlert-dev/ui';
import React from 'react';

import { expandToGenerateThemeColors } from '../utils/colors';
import { toHash } from '../utils/hash';

import { THEME_CLASS_NAME_PREFIX } from './configs';

type Tokens = Parameters<typeof createTheme>[0];
interface CustomizedThemeValues {
  id: string;
  tokens: Tokens;
}

interface CustomizedTheme {
  light: undefined | CustomizedThemeValues;
  dark: undefined | CustomizedThemeValues;
}

export function customizedThemeTokens(
  colors: WidgetTheme['colors']
): CustomizedTheme {
  const baseColors = baseThemeTokens.colors;
  const baseDarkColors = {
    ...baseColors,
    ...defaultDarkColors,
  };
  let lightTheme: CustomizedTheme['light'] = undefined;
  let darkTheme: CustomizedTheme['dark'] = undefined;

  if (colors?.light) {
    const lightColors = expandToGenerateThemeColors(baseColors, colors.light);
    const tokens = { colors: lightColors };
    const id = `${THEME_CLASS_NAME_PREFIX}-light-${toHash(tokens)}`;
    lightTheme = {
      id,
      tokens: tokens as Tokens,
    };
  }

  if (colors?.dark) {
    const darkColors = expandToGenerateThemeColors(
      baseDarkColors,
      colors.dark,
      {
        reverseNeutralRange: true,
      }
    );
    const tokens = { colors: darkColors };
    const id = `${THEME_CLASS_NAME_PREFIX}-dark-${toHash(tokens)}`;
    darkTheme = {
      id,
      tokens: tokens as Tokens,
    };
  }

  return {
    light: lightTheme,
    dark: darkTheme,
  };
}

export function joinList(
  list: { element: React.JSX.Element; key: string }[],
  divider: React.JSX.Element
) {
  if (list.length <= 1) {
    return list.map(({ element, key }) => React.cloneElement(element, { key }));
  }

  const output: React.JSX.Element[] = [];
  list.forEach((item, index) => {
    const { element, key } = item;
    output.push(React.cloneElement(element, { key }));
    if (index < list.length - 1) {
      const key = `divider-${index}`;
      output.push(React.cloneElement(divider, { key }));
    }
  });

  return output;
}
