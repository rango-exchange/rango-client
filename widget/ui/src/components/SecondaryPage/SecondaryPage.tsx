import React, { useState } from 'react';
// import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { styled } from '../../theme';
import { AngleLeftIcon, SearchIcon } from '../Icon';
import { SwapContainer } from '../SwapContainer/SwapContainer';
import { TextField } from '../TextField/TextField';
import { Typography } from '../Typography';

export type PropTypes = (
  | {
      textField: true;
      Content: React.ElementType<{ searchedFor: string }>;
      textFieldPlaceholder: string;
    }
  | {
      textField: false;
      Content: React.ReactNode;
    }
) & {
  title: string;
  onBack?: () => void;
  TopButton?: React.ReactNode;
  Footer?: React.ReactNode;
};

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  padding: '$12',

  '@lg': {
    padding: '$16',
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
  marginBottom: '$16',
});

export function SecondaryPage(props: PropTypes) {
  const { title, Footer, TopButton, onBack } = props;
  const [searchedFor, setSearchedFor] = useState('');

  return (
    <SwapContainer>
      <Container>
        <HeaderContainer>
          <StyledBackIcon size={24} onClick={onBack} />
          <Typography variant="h4">{title}</Typography>
          {TopButton}
        </HeaderContainer>
        {props.textField && (
          <TextField
            prefix={<SearchIcon size={24} />}
            placeholder={props.textFieldPlaceholder}
            onChange={event => setSearchedFor(event.target.value)}
            value={searchedFor}
            autoFocus
          />
        )}
        <ContentContainer>
          {props.textField && <props.Content searchedFor={searchedFor} />}
          {!props.textField && props.Content}
        </ContentContainer>

        {Footer}
      </Container>
    </SwapContainer>
  );
}
