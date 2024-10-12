/* eslint-disable @typescript-eslint/no-magic-numbers */
import type {
  BarStackDataType,
  ChartOptionsType,
  ColorBucketMapType,
  DailyDataType,
} from './BarChart.types.js';

import { MAX_BAR_BUCKETS } from './BarChart.constants.js';

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

export const prepareBarChartData = (chartOption: ChartOptionsType) => {
  const { dailyData, label = 'Count' } = chartOption;
  const chartData: BarStackDataType[] = [];
  const colorBucketMap: ColorBucketMapType = new Map();
  const buckets: string[] = [];

  const { barChartColors } = chartOption;

  // map sum of value for each bucket
  const sumBucketMap = new Map<string, number>();
  dailyData.forEach((dailyItem) => {
    const keyItem = dailyItem.bucket || label;

    const sum = sumBucketMap.get(keyItem) || 0;
    const newValue = dailyItem.value;
    sumBucketMap.set(keyItem, sum + newValue);
  });

  const sortedBucket = Array.from(sumBucketMap).sort((a, b) => b[1] - a[1]);

  // get top buckets for stack bars
  const topBucket = sortedBucket
    .map((sortedItem) => sortedItem[0])
    .slice(0, MAX_BAR_BUCKETS);

  const bucketCount = sumBucketMap.size;

  // create map structure for assign color for each bucket
  topBucket.forEach((bucketItem, index) => {
    colorBucketMap.set(
      bucketItem,
      barChartColors[index % barChartColors.length]
    );
    buckets.push(bucketItem);
  });

  if (bucketCount > MAX_BAR_BUCKETS) {
    colorBucketMap.set('Others', barChartColors[barChartColors.length - 1]);
    buckets.push('Others');
  }

  // create map structure for assign chart data for each date
  const dateMap = new Map<string, DailyDataType[]>();
  dailyData.forEach((dailyItem) => {
    if (!dateMap.has(dailyItem.date)) {
      dateMap.set(dailyItem.date, []);
    }

    const dateItem = dateMap.get(dailyItem.date);
    dateItem?.push(dailyItem);
  });

  // create data result for bar stack chart
  dateMap.forEach((dateDailyList, keyDate) => {
    const dataItem: BarStackDataType = { date: keyDate };
    dateDailyList
      .filter((dailyItem) => topBucket.includes(dailyItem.bucket || label))
      .forEach((topDailyItem) => {
        const bucketValue = topDailyItem.value;
        dataItem[topDailyItem.bucket || label] = bucketValue
          ? bucketValue.toString()
          : '0';
      });

    topBucket.forEach((topItem) => {
      if (!(topItem in dataItem)) {
        dataItem[topItem] = '0';
      }
    });

    if (bucketCount > MAX_BAR_BUCKETS) {
      const otherBuckets = dateDailyList.filter(
        (dailyItem) => dailyItem.bucket && !topBucket.includes(dailyItem.bucket)
      );
      const othersValue = otherBuckets
        .map((dailyItem) => dailyItem.value)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      dataItem['Others'] = othersValue.toString();
    }

    chartData.push(dataItem);
  });
  return { chartData, colorBucketMap, buckets };
};
