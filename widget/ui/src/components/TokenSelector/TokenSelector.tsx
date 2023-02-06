import React from 'react';
import { Token } from 'rango-sdk';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { TokenList } from '../TokenList';

export interface PropTypes {
  list: Token[];
  type: 'Source' | 'Destination';
  selected: Token | null;
  onChange: (token: Token) => void;
  onBack: () => void;
}

export function TokenSelector(props: PropTypes) {
  const { list, type, selected, onChange, onBack } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Token`}
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
