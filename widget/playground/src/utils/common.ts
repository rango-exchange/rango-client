export function shallowEqual<T>(
  object1: { [x: string]: T | undefined },
  object2: { [x: string]: T | undefined }
) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}
