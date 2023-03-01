import React, { useState } from 'react';

import { styled } from '../../theme';
import { BlockchainMeta } from '../../types/meta';
import { BlockchainSelector } from '../BlockchainSelector';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { Close } from '../Icon';
import { Typography } from '../Typography';

export interface PropTypes {
  label?: string;
  selectItem: {
    image: string;
    value: string;
  };
  list: BlockchainMeta[];
  type: 'Blockchains' | 'Tokens' | 'Wallests' | 'Sources';
}

const Cover = styled('div', {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
});
const Popover = styled('div', {
  position: 'absolute',
  zIndex: '2',
});
export function MultiSelect({ label, type, list }: PropTypes) {
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  return (
    <div>
      <Typography mb={4} variant="body2">
        {label}
      </Typography>

      <Button
        onClick={() => setDisplayModal((prev) => !prev)}
        variant="outlined"
        fullWidth
        align="start"
        size="large"
      >
        <Chip selected label={`All ${type}`} suffix={<Close />} />
      </Button>
      {displayModal ? (
        <Popover>
          <Cover onClick={() => setDisplayModal(false)} />
          <BlockchainSelector
            list={list}
            type={'Source'}
            selected={list[0]}
            onChange={(blockChain) => console.log({ blockChain })}
          />
        </Popover>
      ) : null}
    </div>
  );
}
