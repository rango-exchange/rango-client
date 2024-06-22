import type { PropTypes } from './Slider.types';

import { Typography } from '@rango-dev/ui';
import React, { useEffect } from 'react';

import { DEFAULT_THEME_COLORS, PLAYGROUND_CONTAINER_ID } from '../../constants';

import {
  Content,
  RangeWrapper,
  SliderContainer,
  ValueSection,
} from './Slider.styles';

const MAX_VALUE = 100;
const DEFAULT_COLOR = DEFAULT_THEME_COLORS.light.secondary;
function Slider(props: PropTypes) {
  const {
    title,
    showValue,
    value,
    onChange,
    variant = 'custom',
    min,
    max = MAX_VALUE,
    color = DEFAULT_COLOR,
    id,
  } = props;

  const progressScript = () => {
    const sliderEl = document.querySelector(`#${id}`) as HTMLInputElement;
    const sliderValue = parseInt(sliderEl.value);
    const mainValue = sliderValue * (MAX_VALUE / (max as number));
    // Get CSS variables
    const referenceElement = document.querySelector(
      `#${PLAYGROUND_CONTAINER_ID}`
    ) as Element;
    const sliderActiveColor = color;
    const sliderColorInactive = getComputedStyle(
      referenceElement
    ).getPropertyValue('--colors-secondary100');
    sliderEl.style.background = `linear-gradient(to right, ${sliderActiveColor} ${mainValue}%, ${sliderColorInactive} ${mainValue}%)`;
  };

  useEffect(() => {
    progressScript();
  }, [value, color]);

  return (
    <SliderContainer>
      {title && (
        <Typography size="small" variant="body" color="neutral700">
          {title}
        </Typography>
      )}
      <Content>
        <RangeWrapper>
          <input
            type="range"
            id={id}
            min={min || '0'}
            max={max || '100'}
            className={`range range-${variant}`}
            value={value || 0}
            onInput={progressScript}
            onChange={onChange}
          />
        </RangeWrapper>
        {showValue && (
          <ValueSection>
            <Typography
              size="small"
              variant="body"
              align="center"
              color="neutral600">
              {value || 0}
            </Typography>
          </ValueSection>
        )}
      </Content>
    </SliderContainer>
  );
}

export default React.memo(Slider);
