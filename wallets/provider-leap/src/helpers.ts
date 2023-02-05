export function leap_instance() {
  const { leap } = window;

  if (!!leap) return leap;

  return null;
}
