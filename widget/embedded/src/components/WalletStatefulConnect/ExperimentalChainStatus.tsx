import type { PropTypes } from './ExperimentalChainStatus.types';

import { Image, MessageBox } from '@arlert-dev/ui';
import React from 'react';

import {
  LogoContainer,
  Spinner,
  WalletImageContainer,
} from '../ConfirmWalletsModal/WalletList.styles';

import { generateMessageByStatus } from './ExperimentalChainStatus.helpers';

export function ExperimentalChainStatus(props: PropTypes) {
  const { status, displayName, image } = props;
  const data = generateMessageByStatus(status, displayName);
  const hasImage = status == 'in-progress';

  return (
    <MessageBox
      type={data.type}
      title={data.title}
      description={data.description}
      icon={
        hasImage ? (
          <LogoContainer>
            <WalletImageContainer>
              <Image src={image} size={45} />
            </WalletImageContainer>
            <Spinner />
          </LogoContainer>
        ) : undefined
      }
    />
  );
}
