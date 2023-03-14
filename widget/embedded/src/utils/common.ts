export function removeDuplicateFrom<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function areEqual(array1: (number | string)[], array2: (number | string)[]) {
  return array1.length === array2.length && array1.every((v, i) => v === array2[i]);
}
