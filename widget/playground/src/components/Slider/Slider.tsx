import type { PropTypes } from './Slider.types';

import { Typography } from '@yeager-dev/ui';
import React from 'react';

import {
  Content,
  RangeWrapper,
  SliderContainer,
  ValueSection,
} from './Slider.styles';

function Slider(props: PropTypes) {
  const {
    title,
    showValue,
    value,
    onChange,
    variant = 'custom',
    min,
    max,
  } = props;

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
            min={min || '0'}
            max={max || '100'}
            className={`range range-${variant}`}
            value={value || 0}
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
