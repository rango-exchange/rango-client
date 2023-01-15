// TSDX + stiches doesn't work with import statement and has a bug.
// Solution: (https://github.com/stitchesjs/stitches/issues/833#issuecomment-950707025)
const { createStitches } = require('@stitches/react');

export const { styled, css, createTheme , keyframes } = createStitches({
  theme: {
    colors: {
      'primary-500': '#5FA425',
      'neutral-100': '#fff',
      'neutral-200': '#f0f2f5',
      'neutral-300': '#E7E7E7',
      'neutral-400': '#CDCDCD',
      'neutral-500': '#525252',
      'neutral-700': '#333',
      'netural-800': '#222',
      'neutral-900': '#000',
      success: '#0AA65B',
      error: '#F40000',
      info: '#00A9BB',
      warning: '#FF7A00',
      backgroundColor: '$neutral-100',
      backgroundColor2: '$neutral-200',
      backgroundColorDisabled: '$neutral-300',
      text: '$neutral-900',
      borderColor: '$neutral-400',
      hover: '$neutral-300',
    },
    space: {
      0: '0',
      1: '.25rem',
      2: '.5rem',
      3: '.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      18: '4.5rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
    },
    fontSizes: {
      s: '12px',
      m: '14px',
      l: '16px',
      xl: '18px',
      xxl: '24px',
      xxxl: '32px',
      h1: '40px',
    },
    fonts: {},
    fontWeights: {
      s: '400',
      m: '500',
      l: '600',
      xl: '700',
    },
    lineHeights: {},
    letterSpacings: {},
    sizes: {
      0: '0',
      1: '.25rem',
      2: '.5rem',
      3: '.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      18: '4.5rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
    },
    borderWidths: {},
    borderStyles: {},
    radii: {
      s: '.25rem',
      m: '.5rem',
      l: '1rem',
    },
    shadows: {
      s: '0px 3px 5px 3px #f0f2f5, 0px 6px 10px 3px #f0f2f5, 0px 1px 18px 3px #f0f2f5',
    },
    zIndices: {},
    transitions: {},
  },
});

export const lightTheme = createTheme({
  colors: {
    backgroundColor: '$neutral-100',
  },
});

export const darkTheme = createTheme({
  colors: {
    backgroundColor: '$neutral-900',
    text: '$neutral-100',
    backgroundColor2: '$neutral-700',
    backgroundColorDisabled: 'rgba(82, 82, 82, 0.4)',
    borderColor: '$neutral-500',
  },
  shadows: {
    s: '0px 3px 5px 3px #222, 0px 6px 10px 3px #222, 0px 1px 18px 3px #222',
  },
});