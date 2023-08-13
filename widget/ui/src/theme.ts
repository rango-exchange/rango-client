// TSDX + stiches doesn't work with import statement and has a bug.

import type { PropertyValue } from '@stitches/react';
import type { DefaultThemeMap } from '@stitches/react/types/config';

import { createStitches } from '@stitches/react';

/* ----------------------- Values ----------------------- */

const theme = {
  colors: {
    primary: '#4BBA7E',
    primary300: '#9FCEB5',
    primary500: '#4BBA7E',
    primary700: '#35A468',

    secondary: '#7C6DDB',
    secondary100: '#F2EFF9',
    secondary150: '#F0EAFF',
    secondary200: '#E4E0F8',
    secondary250: '#DCD5FF',
    secondary500: '#7C6DDB',
    secondary600: '#6C5DCB',

    lightNeutral100: '#FDFDFD',
    lightNeutral200: '#F9F9F9',
    lightNeutral250: '#F6F6F6',
    lightNeutral300: '#F5F5F5',
    lightNeutral350: '#F2F2F2',
    lightNeutral400: '#EEEEEE',
    lightNeutral500: '#E6E6E6',
    lightNeutral800: '#BCBCBC',
    lightNeutral900: '#A2A2A2',

    darkNeutral100: '#BCBCBC',
    darkNeutral200: '#A2A2A2',
    darkNeutral300: '#727272',
    darkNeutral400: '#565656',
    darkNeutral500: '#373737',
    darkNeutral600: '#272D37',
    darkNeutral700: '#010101',

    error: '#FF3B3B',
    error100: '#FDF3F3',
    error300: '#FFD7D7',
    error500: '#FF3B3B',

    warning: '#FF8800',
    warning100: '#FFF0CC',
    warning300: '#FFDFBB',
    warning500: '#FF8800',

    info: '#AF8EF3',
    info100: '#F0EAFF',
    info300: '#E1D3FF',
    info500: '#AF8EF3',

    link: '#3568D4',
    link100: '#CDE7FF',
    link300: '#9CCFFF',
    link500: '#3568D4',

    success: '#06C270',
    success100: '#D8F4E8',
    success300: '#BDECD7',
    success500: '#06C270',

    background: '#fff',
    foreground: '#000',

    //These should be removed
    primary100: '#FF0000',
    primary200: '#FF0000',
    primary400: '#FF0000',
    primary600: '#FF0000',
    primary800: '#FF0000',
    primary900: '#FF0000',
    surface: '#FF0000',
    success200: '#FF0000',
    success700: '#FF0000',
    warning200: '#FF0000',
    warning700: '#FF0000',
    error200: '#FF0000',
    error700: '#FF0000',
    white: '#FF0000',

    neutral100: '#FF0000',
    neutral200: '#FF0000',
    neutral300: '#FF0000',
    neutral400: '#FF0000',
    neutral500: '#FF0000',
    neutral600: '#FF0000',
    neutral700: '#FF0000',
    neutral800: '#FF0000',
    neutral900: '#FF0000',

    surface100: '#FF0000',
    surface200: '#FF0000',
    surface300: '#FF0000',
    surface400: '#FF0000',
    surface500: '#FF0000',
    surface600: '#FF0000',
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
    md: '20px',
    xl: '35px',
    lg: '40px',
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
  fonts: {},
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
    12: '12px',
    16: '16px',
    18: '18px',
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

const typedCreateStiches = createStitches;

export const { styled, css, createTheme, keyframes, globalCss, config } =
  typedCreateStiches<'', typeof media, typeof theme, DefaultThemeMap>({
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
