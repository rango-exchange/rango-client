export function containsText(text: string, searchText: string): boolean {
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
}

export function getConciseAddress(
  address: string | null,
  maxChars = 8,
  ellipsisLength = 3
): string | null {
  if (!address) return null;
  if (address.length < 2 * maxChars + ellipsisLength) return address;
  const start = Math.ceil((address.length - maxChars) / 2);
  const end = address.length - maxChars;
  return `${address.substr(start, maxChars)}${'.'.repeat(
    ellipsisLength
  )}${address.substr(end)}`;
}

export function limitDecimalPlaces(
  numberString: string,
  maxDecimalPlaces = 4
): string {
  const number = parseFloat(numberString);
  if (isNaN(number))
    return numberString; // Return the original string if it's not a valid number
  else {
    const multiplier = Math.pow(10, maxDecimalPlaces);
    const roundedNumber = Math.round(number * multiplier) / multiplier;
    return roundedNumber.toString();
  }
}

const hexToRgb = (hex: string) =>
  ((value) =>
    value.length === 3
      ? value.split('').map((c) => parseInt(c.repeat(2), 16))
      : (value.match(/.{1,2}/g) || []).map((v) => parseInt(v, 16)))(
    hex.replace('#', '')
  );

const isHexTooDark = (hexColor: string) =>
  (([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b < 40)(
    hexToRgb(hexColor)
  );

const isHexTooLight = (hexColor: string) =>
  (([r, g, b]) => (r * 299 + g * 587 + b * 114) / 1000 > 155)(
    hexToRgb(hexColor)
  );

const colorShade = (col: string, amt: number) => {
  col = col.replace(/^#/, '');
  if (col.length === 3)
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
  let [r, g, b]: any = col.match(/.{2}/g);
  [r, g, b] = [
    parseInt(r, 16) + amt,
    parseInt(g, 16) + amt,
    parseInt(b, 16) + amt,
  ];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? '0' : '') + r;
  const gg = (g.length < 2 ? '0' : '') + g;
  const bb = (b.length < 2 ? '0' : '') + b;

  return `#${rr}${gg}${bb}`;
};

export const generateRangeColors = (
  name: string,
  mode: 'light' | 'dark',
  color?: string,
) => {
  let colors = { [name]: color };
  if (color) {
    let c = color;
    if (isHexTooDark(color) || mode === 'dark') {
      for (let i = 1; i < 10; i++) {
        colors = {
          ...colors,
          [name + i * 100]:
            name === 'neutral'
              ? colorShade(c, i * 15)
              : colorShade(color, i * 5),
        };
      }
    }
    if (isHexTooLight(color) || mode === 'light') {
      for (let i = 1; i < 10; i++) {
        c = colorShade(c, -(i * 5));
        colors = {
          ...colors,
          [name + i * 100]:
            name === 'neutral'
              ? colorShade(c, -(i * 5))
              : colorShade(color, -(i * 5)),
        };
      }
    }
  }
  return colors;
};
