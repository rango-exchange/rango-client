/**
 * Note: This only works native async, if we are going to support for old transpilers like Babel.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isAsync(fn: Function) {
  return fn.constructor.name === 'AsyncFunction';
}
