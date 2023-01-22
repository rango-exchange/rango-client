import React from 'react';
import { TokenMeta } from '../../types/meta';
import SecondaryPage from '../PageWithTextField/SecondaryPage';
import TokenList from '../TokenList';

export interface PropTypes {
  list: TokenMeta[];
  type: 'Source' | 'Destination';
  selected: TokenMeta;
  onChange: (token: TokenMeta) => void;
}

function TokenSelector(props: PropTypes) {
  const { list, type, selected, onChange } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Token`}
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

export default TokenSelector;
