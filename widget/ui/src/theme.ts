// TSDX + stiches doesn't work with import statement and has a bug.

import type { PropertyValue, CSS as StitchesCSS } from '@stitches/react';
import type { DefaultThemeMap } from '@stitches/react/types/config';

import { createStitches } from '@stitches/react';

/* ----------------------- Values ----------------------- */

export const theme = {
  colors: {
    primary: '#1C3CF1',
    primary500: '#1C3CF1',
    primary600: '#0B27C5',

    secondary: '#469BF5',
    secondary100: '#E9F4FF',
    secondary200: '#D6EAFF',
    secondary300: '#C8E3FF',
    secondary400: '#B5D9FF',
    secondary500: '#469BF5',
    secondary600: '#2284ED',
    secondary700: '#242D5B',
    secondary800: '#131C49',
    secondary900: '#0E1744',

    neutral: '#E6E6E6',
    neutral100: '#F9F9F9',
    neutral200: '#F6F6F6',
    neutral300: '#F2F2F2',
    neutral400: '#EEEEEE',
    neutral500: '#E6E6E6',
    neutral600: '#A2A2A2',
    neutral700: '#727272',
    neutral800: '#1B1B1B',
    neutral900: '#121212',

    error100: '#FDF3F3',
    error300: '#FFD7D7',
    error500: '#FF3B3B',
    error600: '#432F2F',
    error700: '#191212',

    warning100: '#FFF1D4',
    warning300: '#FFD8B4',
    warning500: '#F17606',
    warning600: '#38271F',
    warning700: '#1A1412',

    info: '#5BABFF',
    info100: '#E9F3FF',
    info300: '#C8E2FF',
    info500: '#5BABFF',
    info600: '#2E2E41',
    info700: '#121521',

    success100: '#CEFAE6',
    success300: '#BDECD7',
    success500: '#06C270',
    success600: '#1F2825',
    success700: '#0F1412',

    background: '#FDFDFD',
    foreground: '#010101',
  },
  space: {
    0: '0rem',
    5: '0.313rem',
    10: '0.625rem',
    15: '0.938rem',
    20: '1.25rem',
    25: '1.563rem',
    30: '1.875rem',
    40: '2.5rem',
    46: '2.875rem',
    50: '3.125rem',
    60: '3.75rem',
    70: '4.375rem',
    80: '5rem',
    90: '5.625rem',
    100: '6.25rem',

    //These should be removed
    2: '2px',
    4: '4px',
    6: '6px',
    8: '8px',
    12: '12px',
    16: '16px',
    24: '24px',
    28: '28px',
    32: '32px',
  },

  radii: {
    xs: '5px',
    sm: '10px',
    xm: '15px',
    md: '25px',
    xl: '35px',
    lg: '40px',
    primary: '20px',
    secondary: `$md`,
  },

  fontSizes: {
    10: '0.625rem',
    12: '0.75rem',
    14: '0.875rem',
    16: '1rem',
    18: '1.125rem',
    20: '1.25rem',
    22: '1.375rem',
    24: '1.5rem',
    28: '1.75rem',
    32: '2rem',
    36: '2.25rem',
    40: '2.5rem',
    48: '3rem',
  },
  fonts: {
    primary: 'Roboto',
    widget: '$primary',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  lineHeights: {
    12: '0.75rem',
    16: '1rem',
    20: '1.25rem',
    24: '1.5rem',
    26: '1.625rem',
    28: '1.75rem',
    30: '1.875rem',
    36: '2.25rem',
    40: '2.5rem',
    44: '2.75rem',
    52: '3.25rem',
    64: '4rem',
  },
  letterSpacings: {},
  sizes: {
    4: '4px',
    6: '6px',
    8: '8px',
    10: '10px',
    12: '12px',
    16: '16px',
    18: '18px',
    20: '20px',
    24: '24px',
    26: '26px',
    28: '28px',
    30: '30px',
    32: '32px',
    36: '36px',
    40: '40px',
    45: '45px',
    48: '48px',
  },
  borderWidths: {},
  borderStyles: {},
  shadows: {
    s: '0px 3px 5px 3px #f0f2f5, 0px 6px 10px 3px #f0f2f5, 0px 1px 18px 3px #f0f2f5',
  },
  zIndices: {},
  transitions: {},
};
const media = {
  xs: '(min-width: 375px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
};
const utils = {
  bc: (value: PropertyValue<'backgroundColor'>) => ({
    backgroundColor: value,
  }),
};

export const darkColors = {
  secondary: '#2284ED',
  secondary400: '#469BF5',
  secondary500: '#2284ED',
  secondary600: '#2B3462',

  neutral: '#222222',
  neutral900: '#E9E9E9',
  neutral800: '#E6E6E6',
  neutral700: '#B8B8B8',
  neutral600: '#A2A2A2',
  neutral500: '#222222',
  neutral400: '#1B1B1B',
  neutral300: '#121212',
  neutral200: '#111111',
  neutral100: '#101010',

  error500: '#FF5050',

  warning500: '#FF8A20',

  background: '#010101',
  foreground: '#FDFDFD',
};

/* ----------------------- End of Values ----------------------- */

const typedCreateStiches = createStitches;

export const { styled, css, createTheme, keyframes, globalCss, config } =
  typedCreateStiches<'', typeof media, typeof theme, DefaultThemeMap>({
    media,
    theme,
    utils,
  });

export type CSS = StitchesCSS<typeof config>;

export const lightTheme = createTheme('light-theme-ui', {});

export const darkTheme = createTheme('dark-theme-ui', {
  colors: darkColors,
  shadows: {
    s: '0px 3px 5px 3px #222, 0px 6px 10px 3px #222, 0px 1px 18px 3px #222',
  },
});
