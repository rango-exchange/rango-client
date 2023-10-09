/* eslint-disable @typescript-eslint/no-magic-numbers */
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
// eslint-disable-next-line @typescript-eslint/ban-types
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

export function containsText(text: string, searchText: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
}

export const colorShade = (col: string, amt: number) => {
  col = col.replace(/^#/, '');
  if (col.length === 3) {
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
  }
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

export const generateRangeColors = (name: string, color: string) => {
  let colors = { [name]: color };
  for (let i = 1; i < 10; i++) {
    if (i < 5) {
      colors = {
        ...colors,
        [name + i * 100]: colorShade(color, (5 - i) * 32),
      };
    }
    if (i === 5) {
      colors = {
        ...colors,
        [name + i * 100]: color,
      };
    }
    if (i > 5) {
      colors = {
        ...colors,
        [name + i * 100]: colorShade(color, -((i - 5) * 32)),
      };
    }
  }
  return colors;
};
