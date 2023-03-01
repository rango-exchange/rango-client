import React from 'react';
import { AngleDownIcon, Button, styled, TextField, Typography } from '@rangodev/ui';

interface PropTypes {
  type: 'Destination' | 'Source';
}

const Container = styled('div', {
  display: 'grid',
  position: 'relative',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 12,
});

const StyledImage = styled('img', {
  width: '24px',
});

export function TokenInfo(props: PropTypes) {
  return (
    <Container>
      <div>
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
      </div>

      <div>
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
      </div>

      {props.type !== 'Destination' ? <TextField label="default Amount" type="number" /> : null}
    </Container>
  );
}
