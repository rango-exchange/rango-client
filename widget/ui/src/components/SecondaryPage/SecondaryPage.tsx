import React, { ReactNode, useState } from 'react';
import { styled } from '../../theme';
import { AngleLeftIcon, SearchIcon } from '../Icon';
import { TextField } from '../TextField/TextField';
import { Typography } from '../Typography';

export type PropTypes = (
  | {
      textField: true;
      children?: (searchedFor: string) => ReactNode;
      textFieldPlaceholder: string;
    }
  | {
      textField: false;
      children?: ReactNode;
    }
) & {
  title?: string;
  onBack?: () => void;
  TopButton?: React.ReactNode;
  Footer?: React.ReactNode;
  hasHeader?: boolean;
};

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  padding: '$12 0',
  position: 'relative',

  '@lg': {
    padding: '$16 0',
  },
});

const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '$16',
  position: 'relative',
});

const BackIcon = styled(AngleLeftIcon, {
  position: 'absolute',
  left: '0',
});
const StyledBackIcon = styled(BackIcon, {
  cursor: 'pointer',
});

const ContentContainer = styled('div', {
  flex: '1',
  overflowY: 'auto',
  overflowX: 'hidden',
  marginTop: '$16',
});

export function SecondaryPage(props: PropTypes) {
  const { title, Footer, TopButton, onBack, hasHeader = true } = props;
  const [searchedFor, setSearchedFor] = useState('');

  return (
    <Container>
      {hasHeader && (
        <HeaderContainer>
          <StyledBackIcon size={24} onClick={onBack} />
          <Typography variant="h4">{title}</Typography>
          {TopButton}
        </HeaderContainer>
      )}

      {props.textField && (
        <div>
          <TextField
            size="large"
            prefix={<SearchIcon size={24} />}
            placeholder={props.textFieldPlaceholder}
            onChange={(event) => setSearchedFor(event.target.value)}
            value={searchedFor}
            autoFocus
          />
        </div>
      )}
      <ContentContainer>
        {props.textField && props.children?.(searchedFor)}
        {!props.textField && props.children}
      </ContentContainer>
      {Footer}
    </Container>
  );
}
