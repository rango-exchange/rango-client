export function rabby() {
  const { ethereum } = window;

  return ethereum?.isRabby ? ethereum : null;
}
