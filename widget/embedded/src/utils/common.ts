import { WIDGET_UI_ID } from '../constants';

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

export const getContainer = () =>
  document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) as HTMLElement;
