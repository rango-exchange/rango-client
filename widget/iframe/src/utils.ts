export function convertHexToRGB(hex: string) {
  const hexValues = hex.substring(1).match(/.{1,2}/g);
  const rgb = [
    parseInt(hexValues[0], 16),
    parseInt(hexValues[1], 16),
    parseInt(hexValues[2], 16),
  ] as const;

  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}
