import type { PropTypes } from './BlockchainSelectorButton.types';

import { ChevronRightIcon, Divider, Image, Typography } from '@arlert-dev/ui';
import React from 'react';

import {
  Container,
  FlexContainer,
  InputContainer,
} from './BlockchainSelectorButton.styles';

export function BlockchainSelectorButton(props: PropTypes) {
  const { onClick, value, title, hasLogo, placeholder, disabled } = props;

  return (
    <Container>
      <Typography size="large" variant="label">
        {title}
      </Typography>
      <Divider size={10} />
      <InputContainer
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        id="widget-blockchain-selector-container">
        <FlexContainer>
          {hasLogo && (
            <>
              <Image
                src={value?.logo}
                size={16}
                useAsPlaceholder={!value?.logo}
                type="circular"
              />
              <Divider size={4} direction="horizontal" />
            </>
          )}
          <Typography
            className="title_typography"
            size="medium"
            variant="label">
            {value?.name || placeholder}
          </Typography>
        </FlexContainer>
        <ChevronRightIcon size={12} color="black" />
      </InputContainer>
    </Container>
  );
}
