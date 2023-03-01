import React, { useState } from 'react';

import { styled } from '../../theme';
import { BlockchainMeta } from '../../types/meta';
import { BlockchainSelector } from '../BlockchainSelector';
import { Button } from '../Button';
import { AngleDownIcon } from '../Icon';
import { Typography } from '../Typography';

export interface PropTypes {
  label?: string;
  selectItem: {
    image: string;
    value: string;
  };
  list: BlockchainMeta[];
}

const StyledImage = styled('img', {
  width: '24px',
});
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
export function Select({ label, selectItem, list }: PropTypes) {
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  return (
    <div>
      <Typography mb={4} variant="body2">
        {label}
      </Typography>

      <Button
        variant="outlined"
        prefix={<StyledImage src={selectItem.image} />}
        suffix={<AngleDownIcon />}
        fullWidth
        align="start"
        size="large"
        onClick={() => setDisplayModal((prev) => !prev)}
      >
        {selectItem?.value || ''}
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
