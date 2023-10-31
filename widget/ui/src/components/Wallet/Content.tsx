import type { ContentProps } from './Wallet.types';

import React from 'react';

import { Image } from '../common';
import { Typography } from '../Typography';

import { Text, WalletImageContainer } from './Wallet.styles';

function Content(props: ContentProps) {
  const { image, title, description, descriptionColor = 'neutral800' } = props;
  return (
    <>
      <WalletImageContainer>
        <Image src={image} size={35} />
      </WalletImageContainer>

      <Text>
        <Typography variant="label" size="medium" noWrap={false}>
          {title}
        </Typography>

        <Typography
          variant="body"
          size="xsmall"
          noWrap={false}
          color={descriptionColor}>
          {description}
        </Typography>
      </Text>
    </>
  );
}

export default Content;
