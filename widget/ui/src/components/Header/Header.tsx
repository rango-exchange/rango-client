import { styled } from '../../theme';
import React, { PropsWithChildren } from 'react';
import { AngleLeftIcon } from '../Icon';
import { Typography } from '../Typography';
import { Button } from '../Button';

const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$8 0',
  position: 'relative',
});

const BackButton = styled(Button, {
  padding: '$8',
});

interface PropTypes {
  onBack?: () => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  title: string;
}

export function Header(props: PropsWithChildren<PropTypes>) {
  return (
    <HeaderContainer>
      {props.onBack ? (
        <BackButton variant="ghost" size="small" onClick={props.onBack}>
          <AngleLeftIcon size={24} />
        </BackButton>
      ) : null}
      {props.prefix}
      <Typography variant="h4">{props.title}</Typography>
      {props.suffix || <div></div>}
    </HeaderContainer>
  );
}
