export function removeDuplicateFrom<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function areEqual(
  array1: (number | string)[],
  array2: (number | string)[]
) {
  return (
    array1.length === array2.length && array1.every((v, i) => v === array2[i])
  );
}

const hexToRgb = (hex) =>
  ((value) =>
    value.length === 3
      ? value.split('').map((c) => parseInt(c.repeat(2), 16))
      : value.match(/.{1,2}/g).map((v) => parseInt(v, 16)))(
    hex.replace('#', '')
  );

const isHexTooDark = (hexColor) =>
  (([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b < 40)(
    hexToRgb(hexColor)
  );

const isHexTooLight = (hexColor) =>
  (([r, g, b]) => (r * 299 + g * 587 + b * 114) / 1000 > 155)(
    hexToRgb(hexColor)
  );

const colorShade = (col, amt) => {
  col = col.replace(/^#/, '');
  if (col.length === 3)
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
  console.log(col);

  let [r, g, b] = col.match(/.{2}/g);
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

export const GenerateRangeColors = (color, name, mode) => {
  let colors = { [name]: color };
  if (color) {
    let c = color;
    if (isHexTooDark(color) || mode === 'dark') {
      for (let i = 1; i < 10; i++) {
        colors = {
          ...colors,
          [name + i * 100]:
            name === 'neutrals'
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
            name === 'neutrals'
              ? colorShade(c, -(i * 5))
              : colorShade(color, -(i * 5)),
        };
      }
    }
  }
  return colors;
};

export function debounce(fn: Function, time: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null;
  return wrapper;
  function wrapper(...args: any) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, time);
  }
}
