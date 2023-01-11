import React, { ReactElement } from 'react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { styled } from '../../theme';
import Typography from '../Typography';

interface PropTypes {
  title: string;
  Content: (props: { searchedText: string }) => ReactElement;
  onEnter?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  TopButton?: React.ReactNode;
}

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const HeaderContainer = styled('div', {
  display: 'flex',
});

function PageWithTextField(props: PropTypes) {
  const { title, TopButton, Content } = props;
  return (
    <Container>
      <HeaderContainer>
        <ChevronLeftIcon />
        <Typography variant="h2">{title}</Typography>
        {TopButton}
      </HeaderContainer>
      <Content searchedText="" />
    </Container>
  );
}

export default PageWithTextField;
