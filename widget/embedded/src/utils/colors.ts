/* eslint-disable @typescript-eslint/no-magic-numbers */
// Types
import type { ThemeColors, WidgetColors, WidgetColorsKeys } from '../types';

import { isColorKeyOverridden } from './validation';

type RGB = {
  red: number;
  green: number;
  blue: number;
};

type ShadeOrTintFunction = (rgb: RGB, step: number) => RGB;

const HEX_BASE = 16;
const MAX_COLOR_VALUE = 255;
const PERCENT = 0.11;

// Utility Functions

function expandShortHexColor(hexColor: string) {
  // Remove '#' if it exists
  if (hexColor.startsWith('#')) {
    hexColor = hexColor.slice(1);
  }

  // Check if the hexColor has a length of 3
  if (hexColor.length === 3) {
    // Convert the string to an array of characters
    const characters = hexColor.split('');

    // Duplicate each character and combine them into a single string
    const expandedHex = characters.reduce(function (acc, char) {
      return acc + char + char;
    }, '');

    // Return the resulting 6-character hex color
    return `#${expandedHex}`;
  }

  // Return the original hexColor if it's not 3 characters
  return `#${hexColor}`;
}

// pad a hexadecimal string with zeros if it needs it
function pad(number: string, length: number) {
  return number.padStart(length, '0');
}

// Convert an integer to a 2-character hex string
function intToHex(value: number) {
  const clampedValue = Math.min(
    Math.max(Math.round(value), 0),
    MAX_COLOR_VALUE
  );
  return pad(clampedValue.toString(HEX_BASE), 2);
}

// convert one of our rgb color objects to a full hex color string
function rgbToHex(rgb: RGB) {
  return `#${intToHex(rgb.red)}${intToHex(rgb.green)}${intToHex(rgb.blue)}`;
}

// Convert a hex color string to an RGB object
function hexToRGB(hex: string): RGB {
  const red = parseInt(hex.slice(1, 3), HEX_BASE);
  const green = parseInt(hex.slice(3, 5), HEX_BASE);
  const blue = parseInt(hex.slice(5, 7), HEX_BASE);

  return { red, green, blue };
}

// Generate a shade of a given RGB color
function generateShade(rgb: RGB, step: number): RGB {
  const factor = 1 - PERCENT * step;
  return {
    red: rgb.red * factor,
    green: rgb.green * factor,
    blue: rgb.blue * factor,
  };
}

// Generate a tint of a given RGB color
function generateTint(rgb: RGB, step: number): RGB {
  const factor = PERCENT * step;
  return {
    red: rgb.red + (MAX_COLOR_VALUE - rgb.red) * factor,
    green: rgb.green + (MAX_COLOR_VALUE - rgb.green) * factor,
    blue: rgb.blue + (MAX_COLOR_VALUE - rgb.blue) * factor,
  };
}

// Main Functions

// Calculate an array of shades from a hex color string
export function calculateShades(hex: string): string[] {
  return calculateColors(hex, generateShade);
}

// Calculate an array of tints from a hex color string
export function calculateTints(hex: string): string[] {
  return calculateColors(hex, generateTint);
}

// General function to calculate shades or tints
function calculateColors(
  hex: string,
  generateColor: ShadeOrTintFunction
): string[] {
  const rgb = hexToRGB(hex);
  const colors: string[] = [];
  for (let i = 1; i < 9; i++) {
    colors.push(rgbToHex(generateColor(rgb, i)));
  }
  return colors;
}

// Create tints and shades for a given color
export function createTintsAndShades(
  hex: string,
  colorKey: string,
  isReversed?: boolean
): { [key: string]: string } {
  const BASE_INDEX = 100;
  const STEP = 50;

  const tints = calculateTints(hex).reverse().concat(hex);
  const shades = calculateShades(hex);
  const combinedColors = tints.concat(shades);

  const colorMap: { [key: string]: string } = {};
  const length = combinedColors.length;

  for (let i = 0; i < length; i++) {
    const index = BASE_INDEX + (isReversed ? length - 1 - i : i) * STEP;
    const color = combinedColors[i];
    if (color) {
      colorMap[`${colorKey}${index}`] = color;
    }
  }

  return colorMap;
}

// Generate a color palette based on base colors and "Expand Colors"
export function expandToGenerateThemeColors(
  baseColors: ThemeColors,
  expandColors: WidgetColors,
  options?: { reverseNeutralRange?: boolean }
): ThemeColors {
  const output = { ...baseColors };

  for (const colorKey in expandColors) {
    const expandColor = expandColors[colorKey as WidgetColorsKeys] as string;
    const isNeutralReversed =
      colorKey === 'neutral' && !!options?.reverseNeutralRange;
    /*
     *Most of the colors are range but there are some colors that should be a single value e.g.
     *{
     *  // single value
     *   background: "#fff",
     *   // range
     *   primary: '#1C3CF1',
     *    primary500: '#1C3CF1',
     *    primary550: '#0B27C4',
     *}
     */
    const isSingleColor = ['background', 'foreground'].includes(colorKey);

    if (!isSingleColor && !isColorKeyOverridden(colorKey)) {
      const expandedHexColor = expandShortHexColor(expandColor);
      Object.assign(
        output,
        createTintsAndShades(expandedHexColor, colorKey, isNeutralReversed)
      );
    }
  }

  return { ...output, ...expandColors };
}
