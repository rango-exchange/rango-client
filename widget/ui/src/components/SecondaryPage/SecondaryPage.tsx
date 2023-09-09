import type { ReactNode } from 'react';

import React, { useState } from 'react';

import { styled } from '../../theme';
import { Divider } from '../Divider';
import { Header } from '../Header';
import { SearchIcon } from '../Icon';
import { TextField } from '../TextField';

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

const ContentContainer = styled('div', {
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  padding: '0 $4',
});

const TextFieldContainer = styled('div', {
  padding: '1px',
});

/**
 * @deprecated will be removed in v2
 */
export function SecondaryPage(props: PropTypes) {
  const {
    title,
    Footer,
    TopButton,
    // onBack,
    hasHeader = true,
  } = props;
  const [searchedFor, setSearchedFor] = useState('');

  return (
    <>
      {hasHeader && (
        <Header
          // onBack={onBack}
          title={title || ''}
          suffix={TopButton}
        />
      )}

      <ContentContainer>
        {props.textField && (
          <TextFieldContainer>
            <TextField
              size="large"
              prefix={<SearchIcon size={24} />}
              placeholder={props.textFieldPlaceholder}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearchedFor(event.target.value)
              }
              value={searchedFor}
              autoFocus
            />
            <Divider size={16} />
          </TextFieldContainer>
        )}
        {props.textField && props.children?.(searchedFor)}
        {!props.textField && props.children}
      </ContentContainer>
      {Footer}
    </>
  );
}
