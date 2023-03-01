import React, { useState } from 'react';
import { BlockchainSelector, Button, Chip, Close, Modal, styled, Typography } from '@rangodev/ui';
import { blockchainMeta } from './mock';

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

      <Button onClick={()=>setOpen(true)} variant="outlined" fullWidth align="start" size="large">
        <Chip selected label={`All ${type}`} suffix={<Close />} />
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen((prev) => !prev)}
        content={
          <BlockchainSelector
            type={'Source'}
            list={blockchainMeta}
            inModal={true}
            hasHeader={false}
            selected={blockchainMeta[0]}
            onChange={(chain) => console.log(chain)}
          />
        }
        title={`Select Blockchains`}
        containerStyle={{ width: '560px', height: '655px' }}></Modal>
    </div>
  );
}
