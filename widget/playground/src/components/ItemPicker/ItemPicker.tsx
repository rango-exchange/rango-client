import type { PropTypes } from './ItemPicker.types';

import { ChevronRightIcon, Divider, Image, Typography } from '@rango-dev/ui';
import React from 'react';

import { Container, InputContainer, Title } from './ItemPicker.styles';

function ItemPicker(props: PropTypes) {
  const {
    onClick,
    value: { label = '', logo },
    title,
    iconTitle,
    hasLogo,
    placeholder,
    disabled,
  } = props;

  return (
    <Container>
      <Title>
        {iconTitle}
        {iconTitle && <Divider direction="horizontal" size={4} />}
        <Typography size="medium" variant="body">
          {title}
        </Typography>
      </Title>
      <Divider size={8} />
      <InputContainer
        onClick={disabled ? undefined : onClick}
        disabled={disabled}>
        <Title>
          {hasLogo && (
            <>
              <Image
                src={logo}
                size={16}
                useAsPlaceholder={!logo}
                type="circular"
              />
              <Divider size={4} direction="horizontal" />
            </>
          )}
          <Typography size="medium" variant="label" color="neutral900">
            {label || placeholder}
          </Typography>
        </Title>
        <ChevronRightIcon size={12} color="gray" />
      </InputContainer>
    </Container>
  );
}

export default React.memo(ItemPicker);
