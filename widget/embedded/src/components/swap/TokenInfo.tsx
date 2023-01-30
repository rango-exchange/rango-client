import React from 'react';
import { AngleDownIcon, Button, styled, TextField, Typography } from '@rangodev/ui';

interface PropTypes {
  type: 'From' | 'To';
}

const Container = styled('div', {
  boxSizing: 'border-box',
  backgroundColor: '$neutrals300',
  padding: '$24 $8 $8 $8',
  borderRadius: '$5',
  display: 'flex',
  margin: '$16 0',
  position: 'relative',
});

const StyledImage = styled('img', {
  width: '24px',
});

const MaxAmount = styled('div', {
  display: 'flex',
  position: 'absolute',
  right: '$16',
  top: '$6',
});

export function TokenInfo(props: PropTypes) {
  const { type } = props;
  return (
    <Container>
      <div style={{ position: 'absolute', bottom: '100%' }}>
        <Typography variant="body2">{type}</Typography>
      </div>
      {type === 'From' && (
        <MaxAmount>
          <Typography variant="body2">Max:&nbsp;</Typography>
          <Typography variant="body1">1234</Typography>
        </MaxAmount>
      )}
      <Button
        variant="outlined"
        prefix={<StyledImage src="https://api.rango.exchange/blockchains/polygon.svg" />}
        suffix={<AngleDownIcon />}
        size="large"
        style={{ marginRight: '.5rem' }}>
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
        suffix={<AngleDownIcon />}
        size="large"
        style={{ marginRight: '.5rem' }}>
        USDT
      </Button>
      <TextField type="number" size="large" />
    </Container>
  );
}
