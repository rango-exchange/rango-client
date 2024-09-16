/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { BarStackDataType } from './BarChart.types.js';

export const getTotalValueDates = (
  data: BarStackDataType[],
  buckets: string[]
) => {
  const totalValueDates = data.reduce((accumulator, currentData) => {
    const totalValuePerDate = buckets.reduce((dailyTotal, currentBucket) => {
      dailyTotal += !isNaN(Number(currentData[currentBucket]))
        ? Number(currentData[currentBucket])
        : 0;
      return dailyTotal;
    }, 0);
    accumulator.push(totalValuePerDate);
    return accumulator;
  }, [] as number[]);

  return totalValueDates;
};

// Function to generate tick values at intervals of 5, starting from the 5th element
export const generateTickValues = (
  dates: string[],
  start: number,
  interval: number
) => {
  const tickValues = [];
  for (let i = start; i < dates.length; i += interval) {
    tickValues.push(dates[i]);
  }
  return tickValues;
};

export const getTotalValue = (dataColumn: BarStackDataType) => {
  let result = 0;
  Object.keys(dataColumn).forEach((key) => {
    if (key !== 'date') {
      const value = dataColumn[key];
      if (!isNaN(Number(value))) {
        result += Number(value);
      }
    }
  });
  return result;
};

export const getDaysRange = (lengthValue: number) => {
  if (lengthValue < 15) {
    return 7;
  }
  if (lengthValue < 50) {
    return 30;
  }
  return 90;
};
