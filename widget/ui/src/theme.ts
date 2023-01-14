// TSDX + stiches doesn't work with import statement and has a bug.
// Solution: (https://github.com/stitchesjs/stitches/issues/833#issuecomment-950707025)
const { createStitches } = require('@stitches/react');

export const { styled, css } = createStitches({
  theme: {
    colors: {
      primary: '#5FA425',
      white: '#fff',
      black:'#000',
      text01: '#10150F',
      text02: '#0E1617',
      text03: '#555555',
      neutral01: '#D0D0D0',
      neutral02: '#F3F3F3',
      neutral03: '#636363',
      pending: '#838383',
      error: '#DE0700',
      success: '#0AA65B',
    },
    space: {
      s: '4px',
      m: '8px',
      l: '12px',
      xl: '18px',
      xxl: '22px',
      xxxl: '24px',
    },
    fontSizes: {
      xs: '10px',
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
      xs: '14px',
      s: '16px',
      xl: '24px',
      xxl: '28px',
    },
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {},
  },
});
