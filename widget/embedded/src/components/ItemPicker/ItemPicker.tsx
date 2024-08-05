import type { PropTypes } from './ItemPicker.types';

import { ChevronRightIcon, Divider, Image, Typography } from '@rango-dev/ui';
import React from 'react';

import { Container, FlexContainer, InputContainer } from './ItemPicker.styles';

function ItemPicker(props: PropTypes) {
  const {
    onClick,
    value: { label = '', logo },
    title,
    hasLogo,
    placeholder,
    disabled,
  } = props;

  const LogoComponent = logo;
  return (
    <Container>
      <Typography size="large" variant="label">
        {title}
      </Typography>
      <Divider size={10} />
      <InputContainer
        onClick={disabled ? undefined : onClick}
        disabled={disabled}>
        <FlexContainer>
          {hasLogo && (
            <>
              {typeof logo === 'string' || logo === undefined ? (
                <Image
                  src={logo}
                  size={16}
                  useAsPlaceholder={!logo}
                  type="circular"
                />
              ) : (
                LogoComponent && <LogoComponent size={16} />
              )}
              <Divider size={4} direction="horizontal" />
            </>
          )}
          <Typography
            className="title_typography"
            size="medium"
            variant="label">
            {label || placeholder}
          </Typography>
        </FlexContainer>
        <ChevronRightIcon size={12} color="black" />
      </InputContainer>
    </Container>
  );
}

export default React.memo(ItemPicker);
