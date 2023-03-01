import React, { useState } from 'react';
import { Button, Chip, Close, Modal, styled, Typography } from '@rangodev/ui';

interface PropTypes {
  label: string;
  type: 'Blockchains' | 'Tokens' | 'Wallests' | 'Sources';
  modalTitle: string;
}

export function MultiSelect({ label, type, modalTitle }: PropTypes) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <Typography mb={4} variant="body2">
        {label}
      </Typography>

      <Button variant="outlined" fullWidth align="start" size="large">
        <Chip selected label={`All ${type}`} suffix={<Close />} />
      </Button>
      {/* <Modal
        open={open}
        title={modalTitle}
        onClose={() => setOpen(false)}
        content={undefined}
        containerStyle={undefined}></Modal> */}
    </div>
  );
}
