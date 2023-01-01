// TSDX + stiches doesn't work with import statement and has a bug.
// Solution: (https://github.com/stitchesjs/stitches/issues/833#issuecomment-950707025)
const { createStitches } = require('@stitches/react');

export const { styled, css } = createStitches({
  theme: {
    colors: {
      primary: '#5FA425',
      white: '#fff',
      black: '#10150F',

      neutral01: '#D0D0D0',
      neutral02: '#F3F3F3',
      neutral03: '#636363',
    },
    space: {
      s: '4px',
      m: '8px',
      l: '12px',
    },
    fontSizes: {
      s: '14px',
      m: '16px',
      l: '20px',
    },
    fonts: {},
    fontWeights: {
      s: '400',
      m: '600',
      l: '900',
    },
    lineHeights: {},
    letterSpacings: {},
    sizes: {
      s: '16px',
    },
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {},
  },
});
