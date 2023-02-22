import React from 'react';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { TokenList } from '../TokenList';
import { TokenWithAmount } from '../TokenList/TokenList';

export interface PropTypes {
  list: TokenWithAmount[];
  type?: 'Source' | 'Destination';
  selected: TokenWithAmount | null;
  onChange: (token: TokenWithAmount) => void;
  onBack?: () => void;
  hasHeader?: boolean;
}

export function TokenSelector(props: PropTypes) {
  const { list, type, selected, onChange, onBack, hasHeader } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Token`}
      hasHeader={hasHeader}
      onBack={onBack}
      Content={({ searchedFor }) => (
        <TokenList
          searchedText={searchedFor}
          list={list}
          selected={selected}
          onChange={onChange}
        />
      )}
    />
  );
}
