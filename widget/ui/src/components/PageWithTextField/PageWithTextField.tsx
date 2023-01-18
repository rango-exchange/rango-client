import React, { ReactElement, useState } from 'react';
// import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { styled } from '../../theme';
import { AngleLeft, Search } from '../Icon';
import SwapContainer from '../SwapContainer/SwapContainer';
import TextField from '../TextField/TextField';
import Typography from '../Typography';

interface PropTypes {
  title: string;
  Content: (props: { searchedText: string }) => ReactElement;
  onEnter?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onBack?: () => void;
  textFieldPlaceholder: string;
  TopButton?: React.ReactNode;
}

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  padding: '$16',
});

const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '$16',
  position: 'relative',
});

const BackIcon = styled(AngleLeft, {
  position: 'absolute',
  left: '0',
});

const ContentContainer = styled('div', {
  flex: '1',
  overflowY: 'auto',
  marginTop: '$16',
});

const StyledBackIcon = styled(BackIcon, {
  cursor: 'pointer',
});

function PageWithTextField(props: PropTypes) {
  const { title, TopButton, Content, textFieldPlaceholder, onBack } = props;
  const [searchedText, setSearchedText] = useState('');

  return (
    <SwapContainer>
      <Container>
        <HeaderContainer>
          <StyledBackIcon size={24} onClick={onBack} />
          <Typography variant="h4">{title}</Typography>
          {TopButton}
        </HeaderContainer>
        <TextField
          prefix={<Search size={24} />}
          placeholder={textFieldPlaceholder}
          onChange={(event) => setSearchedText(event.target.value)}
          value={searchedText}
          autoFocus
        />
        <ContentContainer>
          <Content searchedText={searchedText} />
        </ContentContainer>
      </Container>
    </SwapContainer>
  );
}

export default PageWithTextField;
