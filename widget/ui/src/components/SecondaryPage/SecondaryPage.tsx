import React, { ReactNode, useState } from 'react';
import { styled } from '../../theme';
import { Header } from '../Header';
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
  action?: React.ReactNode;
  Footer?: React.ReactNode;
  hasHeader?: boolean;
  hasSearch?: boolean;
  onClose?: () => void;
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

const ContentContainer = styled('div', {
  flex: '1',
  overflowY: 'auto',
  overflowX: 'hidden',
  marginTop: '$16',
});

export function SecondaryPage(props: PropTypes) {
  const { title, Footer, action, onBack, hasHeader = true, onClose } = props;
  const [searchedFor, setSearchedFor] = useState('');

  return (
    <Container>
      {hasHeader && (
        <Header
          title={title}
          hasSearch={props.hasSearch}
          searchPlaceholder={props.hasSearch ? props?.searchPlaceholder : ''}
          onSearchChange={(event) => setSearchedFor(event.target.value)}
          searchText={searchedFor}
          onBack={onBack}
          action={action}
          onClose={onClose}
        />
      )}
      <ContentContainer>
        {props.textField && props.children?.(searchedFor)}
        {!props.textField && props.children}
      </ContentContainer>
      {Footer}
    </Container>
  );
}
