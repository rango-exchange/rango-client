import React from 'react';
import { AngleDown, Button, styled, TextField, Typography } from '@rangodev/ui';

interface PropTypes {
  label: 'From' | 'To';
}

const Container = styled('div', {
  backgroundColor: '$neutrals200',
  padding: '$8',
  borderRadius: '$5',
  display: 'flex',
  margin: '$16 0',
  position: 'relative',
});

const StyledImage = styled('img', {
  width: '24px',
});

export function TokenInfo(props: PropTypes) {
  const { label } = props;
  return (
    <Container>
      <div style={{ position: 'absolute', bottom: '100%' }}>
        <Typography variant="body2">{label}</Typography>
      </div>
      <Button
        variant="outlined"
        prefix={<StyledImage src="https://api.rango.exchange/blockchains/polygon.svg" />}
        suffix={<AngleDown />}
        style={{ backgroundColor: 'white' }}>
        Polygon
      </Button>
      <Button
        variant="outlined"
        prefix={
          <StyledImage
            src="https://api.rango.exchange/i/aR1yFx
"
            su
          />
        }
        suffix={<AngleDown />}
        style={{ backgroundColor: 'white' }}>
        USDT
      </Button>
      <TextField type="number" />
    </Container>
  );
}
