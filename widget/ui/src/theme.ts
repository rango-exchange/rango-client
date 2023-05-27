// TSDX + stiches doesn't work with import statement and has a bug.

import { PropertyValue, CreateStitches } from '@stitches/react';
import { DefaultThemeMap } from '@stitches/react/types/config';
import { createStitches } from '@stitches/react';

/* ----------------------- Values ----------------------- */

const theme = {
  colors: {
    primary: '#5FA425',
    primary100: '#9FC87C',
    primary200: '#8FBF66',
    primary300: '#7FB651',
    primary400: '#6FAD3B',
    primary500: '#5FA425',
    primary600: '#4C831E',
    primary700: '#396216',
    primary800: '#26420F',
    primary900: '#132107',
    surface: '#fff',
    neutral100: '#f3f3f3',
    neutral200: '#FAFAFA',
    neutral300: '#EAEAEA',
    neutral400: '#999999',
    neutral500: '#888888',
    neutral600: '#666666',
    neutral700: '#444444',
    neutral800: '#333333',
    neutral900: '#111111',
    background: '#fff',
    foreground: '#000',
    success: '#0070F3',
    success100: '#D3E5FF',
    success300: '#3291FF',
    success500: '#0070F3',
    success700: '#0761D1',
    warning: '#F5A623',
    warning100: '#FFEFCF',
    warning300: '#F7B955',
    warning500: '#F5A623',
    warning700: '#AB570A',
    error: '#FF0000',
    error100: '#F7D4D6',
    error300: '#FF3333',
    error500: '#FF0000',
    error700: '#E60000',
    // Only use this color when you are going to use white for both dark and light theme.
    white: '#fff',
  },
  space: {
    2: '2px',
    4: '4px',
    6: '6px',
    8: '8px',
    10: '10px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    28: '28px',
    30: '30px',
    32: '32px',
  },
  fontSizes: {
    10: '10px',
    12: '12px',
    14: '14px',
    16: '16px',
    18: '18px',
    20: '20px',
    24: '24px',
    32: '32px',
    36: '36px',
    40: '40px',
    48: '48px',
  },
  fonts: {},
  fontWeights: {
    400: '400',
    500: '500',
    600: '600',
    700: '700',
  },
  lineHeights: {},
  letterSpacings: {},
  sizes: {
    4: '4px',
    6: '6px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    28: '28px',
    32: '32px',
    36: '36px',
    40: '40px',
    48: '48px',
  },
  borderWidths: {},
  borderStyles: {},
  radii: {
    5: '8px',
    10: '12px',
  },
  shadows: {
    s: '0px 3px 5px 3px #f0f2f5, 0px 6px 10px 3px #f0f2f5, 0px 1px 18px 3px #f0f2f5',
  },
  zIndices: {},
  transitions: {},
};
const media = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
};
const utils = {
  bc: (value: PropertyValue<'backgroundColor'>) => ({
    backgroundColor: value,
  }),
};

/* ----------------------- End of Values ----------------------- */

const typedCreateStiches = createStitches as CreateStitches;

export const { styled, css, createTheme, keyframes, globalCss, config } = typedCreateStiches<
  '',
  typeof media,
  typeof theme,
  DefaultThemeMap,
  // TODO: Make `utils` typesafe as well.
  {}
>({
  media,
  theme,
  utils,
});

export const lightTheme = createTheme({});

export const darkTheme = createTheme({
  colors: {
    surface: '#000',
    neutral900: '#f3f3f3',
    neutral800: '#FAFAFA',
    neutral700: '#EAEAEA',
    neutral600: '#999999',
    neutral500: '#888888',
    neutral400: '#666666',
    neutral300: '#444444',
    neutral200: '#333333',
    neutral100: '#111111',
    foreground: '#fff',
    background: '#000',
  },
  shadows: {
    s: '0px 3px 5px 3px #222, 0px 6px 10px 3px #222, 0px 1px 18px 3px #222',
  },
});
