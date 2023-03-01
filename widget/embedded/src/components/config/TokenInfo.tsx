import React from 'react';
import { AngleDownIcon, Button, Spacer, styled, TextField, Typography } from '@rangodev/ui';

interface PropTypes {
  type: 'Destination' | 'Source';
}

const Container = styled('div', {
  display: 'flex',
  position: 'relative',
});

const StyledImage = styled('img', {
  width: '24px',
});

const SelectButton = styled('div', {
  flex: 1,
});

export function TokenInfo(props: PropTypes) {
  return (
    <Container>
      <SelectButton>
        <Typography mb={4} variant="body2">
          default Blockchains
        </Typography>

        <Button
          variant="outlined"
          prefix={<StyledImage src="https://api.rango.exchange/blockchains/polygon.svg" />}
          suffix={<AngleDownIcon />}
          fullWidth
          align="start"
          size="large">
          Polygon
        </Button>
      </SelectButton>

      <Spacer size={12} />
      <SelectButton>
        <Typography mb={4} variant="body2">
          default Token
        </Typography>
        <Button
          variant="outlined"
          prefix={<StyledImage src="https://api.rango.exchange/i/aR1yFx" />}
          suffix={<AngleDownIcon />}
          fullWidth
          align="start"
          size="large">
          USDT
        </Button>
      </SelectButton>

      {props.type !== 'Destination' ? (
        <>
          <Spacer size={12} />
          <TextField label="default Amount" type="number" />
        </>
      ) : null}
    </Container>
  );
}
