import React from 'react';
import {
  AngleDownIcon,
  Button,
  Chip,
  Close,
  Spacer,
  styled,
  TextField,
  Typography,
} from '@rangodev/ui';

interface PropTypes {
  label: string;
  type: 'Blockchains' | 'Tokens' | 'Wallests' | 'Sources';
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

export function MultiSelect({ label, type }: PropTypes) {
  return (
    <SelectButton>
      <Typography mb={4} variant="body2">
        {label}
      </Typography>

      <Button
        variant="outlined"
        fullWidth
        align="start"
        size="large">
        <Chip selected label={`All ${type}`} suffix={<Close />} />
      </Button>
    </SelectButton>
  );
}
