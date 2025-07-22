/* eslint-disable @typescript-eslint/no-magic-numbers */
import type {
  BarChartPropTypes,
  BarStackDataType,
  BottomAxisData,
  TooltipDataType,
} from './BarChart.types.js';
import type { BarGroupBar, SeriesPoint } from '@visx/shape/lib/types';

import { Divider } from '@arlert-dev/ui';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack } from '@visx/shape';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import React, { Fragment, useEffect, useRef } from 'react';

import useIsMobile from '../../hooks/useIsMobile.js';
import {
  AmountConverter,
  compactNumberFormat,
} from '../../utils/amountConverter.js';
import { getDayOfMonth } from '../../utils/common.js';

import {
  bottomAxisData,
  DEFAULT_CHART_COLORS,
  DEFAULT_MARGIN,
  TOOLTIP_DELAY_MS,
  TOOLTIP_HIDE_DELAY_MS,
} from './BarChart.constants.js';
import {
  generateTickValues,
  getDaysRange,
  getEvenlySpacedNumber,
  getTotalValue,
  getTotalValueDates,
} from './BarChart.helpers.js';
import {
  Circle,
  Container,
  InfoContainer,
  Line,
  NameWrapper,
  TooltipContainer,
  TooltipInfoRow,
} from './BarChart.styles.js';

dayjs.extend(utc);

export const BarChart = (props: BarChartPropTypes) => {
  const {
    data,
    width,
    height,
    colorBucketMap,
    buckets,
    margin = DEFAULT_MARGIN,
    getLabel,
    isDarkTheme = false,
  } = props;

  const isMobile = useIsMobile();
  const daysRange = getDaysRange(data.length);

  let bottomAxis: BottomAxisData;
  if (data.length > 90) {
    const count = 7;
    const interval = getEvenlySpacedNumber(data.length, count);
    bottomAxis = {
      numBottomAxis: count,
      intervalBottomAxis: interval,
      startBottomAxis: interval - 10,
    };
  } else {
    bottomAxis =
      width < 700
        ? bottomAxisData.mobile[daysRange]
        : bottomAxisData.desktop[daysRange];
  }

  const { intervalBottomAxis, numBottomAxis, startBottomAxis } = bottomAxis;

  let tooltipTimeout: number;
  const tooltipRef = useRef<HTMLInputElement>(null);

  // bounds
  const xMax = width - margin.left - 20;
  const yMax = height - margin.top - 30;

  // accessors
  const getDate = (d: BarStackDataType) => d.date;

  // handle bottom axis data
  const allDate = data.map(getDate);

  const bottomAxisValue = generateTickValues(
    allDate,
    startBottomAxis,
    intervalBottomAxis
  );

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipDataType>();

  const totalValueDates = getTotalValueDates(data, buckets);

  // scales
  const dateScale = scaleBand<string>({
    domain: data.map(getDate),
    paddingInner: daysRange === 7 ? 0.3 : 0.46,
    paddingOuter: daysRange === 90 ? 1 : 0.3,
  });

  const totalValue = Math.max(...totalValueDates);

  const scaledMaxValue = totalValue + totalValue / 5;
  const valueScale = scaleLinear<number>({
    domain: [0, scaledMaxValue < 0.5 ? 0.5 : scaledMaxValue],
    nice: true,
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: buckets,
    range: DEFAULT_CHART_COLORS,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleClickOutside(event: any) {
      if (
        isMobile &&
        tooltipRef?.current &&
        !tooltipRef.current.contains(event.target)
      ) {
        hideTooltip();
      }
    }
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [tooltipRef, isMobile]);

  dateScale.range([0, xMax]);
  valueScale.range([yMax, 0]);

  if (width < 10) {
    return null;
  }

  const handleBarClick = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    bar: Omit<BarGroupBar<string>, 'key' | 'value'> & {
      bar: SeriesPoint<BarStackDataType>;
      key: string;
    },
    index: number
  ) => {
    if (isMobile) {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
      const eventSvgCoords = localPoint(event);
      const left = bar.x + bar.width / 2;
      setTimeout(() => {
        showTooltip({
          tooltipData: { bar, hoveredIndex: index },
          tooltipTop: eventSvgCoords?.y,
          tooltipLeft: left,
        });
      }, TOOLTIP_DELAY_MS);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
      }, TOOLTIP_HIDE_DELAY_MS);
    }
  };

  const handleMouseMove = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    bar: Omit<BarGroupBar<string>, 'key' | 'value'> & {
      bar: SeriesPoint<BarStackDataType>;
      key: string;
    },
    index: number
  ) => {
    if (!isMobile) {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
      /*
       * TooltipInPortal expects coordinates to be relative to containerRef
       * localPoint returns coordinates relative to the nearest SVG, which
       * is what containerRef is set to in this example.
       */
      const eventSvgCoords = localPoint(event);
      const left = bar.x + bar.width / 2 + 40;

      // make sure to pass the index of the hovered bar
      showTooltip({
        tooltipData: { bar, hoveredIndex: index },
        tooltipTop: eventSvgCoords?.y,
        tooltipLeft: left,
      });
    }
  };

  const getFormattedTotalValue = (data: BarStackDataType) =>
    AmountConverter(Number(getTotalValue(data).toFixed(2)));

  return (
    <Container>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
        />
        <Grid
          top={margin.top}
          left={margin.left + 10}
          xScale={dateScale}
          yScale={valueScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          numTicksRows={5}
          numTicksColumns={0}
          columnLineStyle={{ display: 'none' }}
          rowLineStyle={{
            stroke: '#B8B8B8',
          }}
        />

        <Group top={margin.top} left={margin.left + 10}>
          <BarStack
            data={data}
            keys={buckets}
            x={getDate}
            xScale={dateScale}
            yScale={valueScale}
            color={colorScale}>
            {(barStacks) => {
              /*
               * barStacks returns an array of series objects broken down by key.
               */
              return barStacks.map((barStack) =>
                /*
                 * each barStack contains an array of bars, which contain the data
                 * for only that series for a given data point. the number of bars in a
                 * given stack corresponds to the number of data points in our data array
                 */

                barStack.bars.map((bar, index) => {
                  /*
                   * we can then assume that the data in each stack at a given index
                   * is related to the data in all other stacks at that index.
                   */
                  const shouldBeHighlighted =
                    tooltipData?.hoveredIndex === index;

                  /*
                   * we can then decide the opacity for our stacks based on whether the
                   * tooltip is open, and whether the stack being hovered matches the
                   * index passed to our tooltipData
                   */
                  const shouldHavePartialOpacity =
                    !shouldBeHighlighted && tooltipOpen;

                  const barColor =
                    colorBucketMap.get(barStack.key) || bar.color;

                  return (
                    <rect
                      key={`bar-stack-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      height={bar.height}
                      width={bar.width}
                      fill={barColor}
                      opacity={shouldHavePartialOpacity ? 0.5 : 1}
                      onClick={(event) => handleBarClick(event, bar, index)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={(event) =>
                        handleMouseMove(event, bar, index)
                      }
                    />
                  );
                })
              );
            }}
          </BarStack>
        </Group>

        <AxisBottom
          top={yMax + margin.top}
          left={margin.left + 10}
          scale={dateScale}
          hideAxisLine
          hideTicks
          numTicks={numBottomAxis}
          tickValues={bottomAxisValue}
          tickFormat={(d) => getDayOfMonth(d)}
          tickLabelProps={() => ({
            fontSize: isMobile ? 10 : 12,
            fill: isDarkTheme ? '#B8B8B8' : '#A2A2A2',
            textAnchor: 'middle',
          })}
        />

        <AxisLeft
          hideAxisLine
          hideTicks
          numTicks={isMobile ? 3 : 5}
          top={margin.top}
          left={margin.left}
          scale={valueScale}
          tickFormat={(d) => compactNumberFormat(Number(d))}
          tickLabelProps={() => ({
            fontSize: isMobile ? 10 : 12,
            fill: isDarkTheme ? '#B8B8B8' : '#A2A2A2',
            textAnchor: 'middle',
          })}
        />
      </svg>

      {tooltipData && tooltipOpen && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            position: 'absolute',
            zIndex: '99999999',
          }}>
          <TooltipContainer ref={tooltipRef}>
            {tooltipData?.bar.bar.data.date && (
              <TooltipInfoRow>
                <div>
                  {dayjs
                    .utc(tooltipData.bar.bar.data.date)
                    .local()
                    .format('YYYY/MM/DD')
                    .toString()}
                </div>
                <div>
                  {getLabel
                    ? getLabel(getFormattedTotalValue(tooltipData.bar.bar.data))
                    : getFormattedTotalValue(tooltipData.bar.bar.data)}
                </div>
              </TooltipInfoRow>
            )}
            {Array.from(colorBucketMap).map((mapItem) => {
              const [bucketItem, bucketColor] = mapItem;
              const value = tooltipData?.bar.bar.data[bucketItem];
              const formattedValue = !isNaN(Number(value))
                ? AmountConverter(Number(Number(value).toFixed(2)))
                : '0';
              return (
                <Fragment key={bucketItem}>
                  <Line />
                  <InfoContainer>
                    <NameWrapper>
                      <Circle style={{ backgroundColor: bucketColor }} />
                      <Divider direction="horizontal" size={'4'} />
                      <span>{bucketItem}</span>
                    </NameWrapper>
                    <Divider direction="horizontal" size={'10'} />

                    <span>
                      {getLabel ? getLabel(formattedValue) : formattedValue}
                    </span>
                  </InfoContainer>
                </Fragment>
              );
            })}
          </TooltipContainer>
        </TooltipWithBounds>
      )}
    </Container>
  );
};
