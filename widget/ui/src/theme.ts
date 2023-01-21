// TSDX + stiches doesn't work with import statement and has a bug.

import { PropertyValue } from '@stitches/react';

// Solution: (https://github.com/stitchesjs/stitches/issues/833#issuecomment-950707025)
const { createStitches } = require('@stitches/react');

export const { styled, css, createTheme, keyframes } = createStitches({
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
  },
  theme: {
    colors: {
      primary: '#5FA425',
      primary100: '#9FC87C',
      primary200: '#8FBF66',
      primary300
      : '#7FB651',
      primary400: '#6FAD3B',
      primary500: '#5FA425',
      primary600: '#4C831E',
      primary700: '#396216',
      primary800: '#26420F',
      primary900: '#132107',
      neutrals200: '#FAFAFA',
      neutrals300: '#EAEAEA',
      neutrals400: '#999999',
      neutrals500: '#888888',
      neutrals600: '#666666',
      neutrals700: '#444444',
      neutrals800: '#333333',
      neutrals900: '#111111',
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
    },
    space: {
      2: '2px',
      4: '4px',
      6: '6px',
      8: '8px',
      10: '10px',
      12: '12px',
      16: '16px',
      24: '24px',
      30: '30px',
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
      5: '5px',
      10: '10px',
    },
    shadows: {
      s: '0px 3px 5px 3px #f0f2f5, 0px 6px 10px 3px #f0f2f5, 0px 1px 18px 3px #f0f2f5',
    },
    zIndices: {},
    transitions: {},
  },
  utils: {
    bc: (value: PropertyValue<'backgroundColor'>) => ({
      backgroundColor: value,
    }),
  },
});

export const lightTheme = createTheme({});

export const darkTheme = createTheme({
  colors: { foreground: '#fff', background: '#000' },
});
