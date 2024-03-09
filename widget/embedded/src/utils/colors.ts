import type { WidgetColors, WidgetColorsKeys } from '../types';

export function generateShades(
  baseColor: string,
  prefix: string,
  reverse?: boolean
): { [key: string]: string } {
  const BASE_SHADE_INDEX = 100;
  const NUMBER_OF_COLORS = 9;
  const SHADING_INCREMENT_MAX = 10; // For bright colors
  const SHADING_INCREMENT_MIN = 6; // For dark colors

  const HALF_NUMBER_OF_COLORS = 4;

  const shadeIncrements: number[] = [];
  let increment = 90;
  for (let i = 0; i < NUMBER_OF_COLORS; i++) {
    shadeIncrements.push(increment);
    if (i + 1 === HALF_NUMBER_OF_COLORS) {
      increment = 0;
    } else {
      increment -=
        i >= HALF_NUMBER_OF_COLORS
          ? SHADING_INCREMENT_MIN
          : SHADING_INCREMENT_MAX;
    }
  }

  // If 'reverse' is true, that means the color should be from dark to light
  const decrementAmounts = reverse
    ? shadeIncrements.slice().reverse()
    : shadeIncrements;

  const shades: { [key: string]: string } = {};

  // Generate shades
  for (let i = 0; i < NUMBER_OF_COLORS; i++) {
    const shadeIndex = BASE_SHADE_INDEX + i * BASE_SHADE_INDEX;
    const decrementAmount = decrementAmounts[i];

    const shade: { [key: string]: string } = {
      [`${prefix}${shadeIndex}`]: generateShade(baseColor, decrementAmount),
    };
    Object.assign(shades, shade);
  }

  return { ...shades, [prefix]: baseColor };
}

export function generateShade(
  baseColor: string,
  decrementAmount: number
): string {
  const [r, g, b] = convertToRGB(baseColor);
  return `#${clamp(r + decrementAmount)}${clamp(g + decrementAmount)}${clamp(
    b + decrementAmount
  )}`;
}

export function convertToRGB(baseColor: string): number[] {
  const COLOR_SLICE_START = 1;
  const COLOR_SLICE_END = 3;
  const BASE_COLOR_LENGTH = 7;

  // Convert the base color to RGB components
  const r: number = parseInt(
    baseColor.slice(COLOR_SLICE_START, COLOR_SLICE_END),
    16
  );
  const g: number = parseInt(
    baseColor.slice(COLOR_SLICE_END, COLOR_SLICE_END + 2),
    16
  );
  const b: number = parseInt(
    baseColor.slice(COLOR_SLICE_END + 2, BASE_COLOR_LENGTH),
    16
  );

  return [r, g, b];
}

// Function to clamp color component to valid range [0, 255] and convert to hex
function clamp(color: number): string {
  const MAX_COLOR_VALUE = 255;
  const HEX_BASE = 16;
  const HEX_LENGTH = -2;
  return (
    '0' + Math.max(0, Math.min(MAX_COLOR_VALUE, color)).toString(HEX_BASE)
  )
    .slice(HEX_LENGTH)
    .toUpperCase();
}

export function isBright(baseColor: string) {
  const BRIGHTNESS_THRESHOLD = 188;
  const RED_COEFFICIENT = 299;
  const GREEN_COEFFICIENT = 587;
  const BLUE_COEFFICIENT = 114;
  const BRIGHTNESS_DIVISOR = 1000;

  const [r, g, b] = convertToRGB(baseColor);
  const brightness =
    (r * RED_COEFFICIENT + g * GREEN_COEFFICIENT + b * BLUE_COEFFICIENT) /
    BRIGHTNESS_DIVISOR;
  if (brightness > BRIGHTNESS_THRESHOLD) {
    return true;
  }
  return false;
}

export const generateColors = (
  mainColors: { [x: string]: string },
  reverseNeutralRange: boolean,
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
        const reverse = colorKey === 'neutral' && reverseNeutralRange;
        listOfColors = {
          ...listOfColors,
          ...generateShades(color, colorKey, reverse),
        };
      }
    }
  }
  return changeColors ? listOfColors : {};
};
