import type { WidgetColors, WidgetColorsKeys } from '../types';

export const colorShade = (col: string, amt: number) => {
  const RANGE = 255;
  const COL = 3;
  const RADIX = 16;

  col = col.replace(/^#/, '');
  if (col.length === COL) {
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
  }
  let [r, g, b]: any = col.match(/.{2}/g);
  [r, g, b] = [
    parseInt(r, RADIX) + amt,
    parseInt(g, RADIX) + amt,
    parseInt(b, RADIX) + amt,
  ];

  r = Math.max(Math.min(RANGE, r), 0).toString(RADIX);
  g = Math.max(Math.min(RANGE, g), 0).toString(RADIX);
  b = Math.max(Math.min(RANGE, b), 0).toString(RADIX);

  const rr = (r.length < 2 ? '0' : '') + r;
  const gg = (g.length < 2 ? '0' : '') + g;
  const bb = (b.length < 2 ? '0' : '') + b;

  return `#${rr}${gg}${bb}`;
};

export const generateRangeColors = (name: string, color: string) => {
  const NUMBER_OF_COLORS = 10;
  const HALF_NUMBER_OF_COLORS = 5;
  const COLOR_SUFFIX = 100;
  const AMT = 32;

  let colors = { [name]: color };
  for (let i = 1; i < NUMBER_OF_COLORS; i++) {
    if (i < HALF_NUMBER_OF_COLORS) {
      colors = {
        ...colors,
        [name + i * COLOR_SUFFIX]: colorShade(
          color,
          (HALF_NUMBER_OF_COLORS - i) * AMT
        ),
      };
    }
    if (i === HALF_NUMBER_OF_COLORS) {
      colors = {
        ...colors,
        [name + i * COLOR_SUFFIX]: color,
      };
    }
    if (i > HALF_NUMBER_OF_COLORS) {
      colors = {
        ...colors,
        [name + i * COLOR_SUFFIX]: colorShade(
          color,
          -((i - HALF_NUMBER_OF_COLORS) * AMT)
        ),
      };
    }
  }
  return colors;
};
export const generateColors = (
  mainColors: { [x: string]: string },
  colors?: WidgetColors
) => {
  if (!colors || !Object.entries(colors).length) {
    return {};
  }
  let changeColors = false;
  let listOfColors = { ...mainColors };
  for (const colorKey in colors) {
    const color = colors[colorKey as WidgetColorsKeys];

    if (!!color && color !== mainColors[colorKey]) {
      changeColors = true;
      if (colorKey === 'background' || colorKey === 'foreground') {
        listOfColors = {
          ...listOfColors,
          [colorKey]: color,
        };
      } else {
        listOfColors = {
          ...listOfColors,
          ...generateRangeColors(colorKey, color),
        };
      }
    }
  }
  return changeColors ? listOfColors : {};
};
