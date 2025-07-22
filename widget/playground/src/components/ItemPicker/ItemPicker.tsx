import type { PropTypes } from './ItemPicker.types';

import {
  ChevronRightIcon,
  Divider,
  Image,
  InfoIcon,
  Tooltip,
  Typography,
} from '@arlert-dev/ui';
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
    tooltip,
    disabled,
  } = props;

  const LogoComponent = logo;
  return (
    <Container>
      <Title>
        {iconTitle}
        {iconTitle && <Divider direction="horizontal" size={4} />}
        <Typography size="medium" variant="body">
          {title}
        </Typography>
        <Divider size={4} direction="horizontal" />

        {tooltip && (
          <Tooltip content={tooltip} side="top">
            <InfoIcon size={14} color="gray" />
          </Tooltip>
        )}
      </Title>
      <Divider size={4} />
      <InputContainer
        onClick={disabled ? undefined : onClick}
        disabled={disabled}>
        <Title>
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
            variant="label"
            color="neutral700">
            {label || placeholder}
          </Typography>
        </Title>
        <ChevronRightIcon size={12} color="gray" />
      </InputContainer>
    </Container>
  );
}

export default React.memo(ItemPicker);
