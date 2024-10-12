const THRESHOLD = 1000;
const BASE_TEN = 10;
const PERCENTAGE_MULTIPLIER = 100;

const unitList = ['', 'K', 'M', 'B'];
export function AmountConverter(number: number) {
  const sign = Math.sign(number);
  let unit = 0;
  while (Math.abs(number) > THRESHOLD) {
    unit = unit + 1;
    number = Math.floor(Math.abs(number) / BASE_TEN) / PERCENTAGE_MULTIPLIER;
  }
  return sign * Math.abs(number) + unitList[unit];
}

export function getPercentageChange(
  input: number | null,
  output: number | null
) {
  if (!input || !output) {
    return null;
  }
  return parseFloat(
    Number((output / input - 1) * PERCENTAGE_MULTIPLIER).toFixed(2)
  );
}

export function numberWithCommas(number: number) {
  if (!number || isNaN(number)) {
    return number;
  }

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function compactNumberFormat(number: number) {
  if (!number || isNaN(number)) {
    return '0';
  }

  const numberFormat = Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);

  return numberFormat;
}
