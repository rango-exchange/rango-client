// TSDX + stiches doesn't work with import statement and has a bug.
// Solution: (https://github.com/stitchesjs/stitches/issues/833#issuecomment-950707025)
const { createStitches } = require('@stitches/react');

export const { styled, css } = createStitches({
  theme: {
    colors: {
      primary: 'green',
      white: '#fff',
      black: '#333',
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
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {},
  },
});
