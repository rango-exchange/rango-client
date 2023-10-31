import type { PropTypes } from './ColorPicker.types';
import type { ColorResult } from 'react-color';

import { Button, Popover, Typography } from '@rango-dev/ui';
import React from 'react';
import { ChromePicker } from 'react-color';

import { ColorButton, ColorDiv, Container } from './ColorPickerstyles';

function ColorPicker(props: PropTypes) {
  const { label, placeholder, color, onChangeColor, onReset, resetDisable } =
    props;
  const onChange = (c: ColorResult) => {
    onChangeColor(c.hex);
  };
  return (
    <Container>
      <Typography variant="body" size="small" color="neutral700">
        {label}
      </Typography>
      <Popover
        side="top"
        content={<ChromePicker color={color} onChange={onChange} />}>
        <ColorButton
          size="small"
          variant="default"
          prefix={<ColorDiv style={{ backgroundColor: color }} />}>
          <Typography variant="label" size="medium" color="neutral600">
            {color || placeholder}
          </Typography>
        </ColorButton>
      </Popover>
      <Button
        onClick={onReset}
        disabled={resetDisable}
        size="small"
        variant="ghost">
        <Typography variant="body" size="small" color="neutral600">
          Reset
        </Typography>
      </Button>
    </Container>
  );
}

export default React.memo(ColorPicker);
