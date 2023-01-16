import React, { ReactElement, useEffect, useRef, useState } from 'react';
// import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { styled } from '../../theme';
import { AngleLeft, Search } from '../Icon';
import TextField from '../TextField/TextField';
import Typography from '../Typography';

interface PropTypes {
  title: string;
  Content: (props: { searchedText: string }) => ReactElement;
  onEnter?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  textFieldPlaceholder: string;
  TopButton?: React.ReactNode;
}

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  padding: '$4',
});

const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '$4',
  position: 'relative',
});

const BackIcon = styled(AngleLeft, {
  position: 'absolute',
  left: '$0',
});

const ContentContainer = styled('div', {
  overflowY: 'scroll',
  marginTop: '$4',
});

function PageWithTextField(props: PropTypes) {
  const { title, TopButton, Content, textFieldPlaceholder } = props;
  const [searchedText, setSearchedText] = useState('');

  return (
    <Container>
      <HeaderContainer>
        <BackIcon size={28} />
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
  );
}

export default PageWithTextField;
