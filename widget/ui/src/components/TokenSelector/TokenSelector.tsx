import React from 'react';
import { TokenMeta } from '../../types/meta';
import PageWithTextField from '../PageWithTextField';
import TokenList from '../TokenList';

export interface PropTypes {
  tokens: TokenMeta[];
  type: 'Source' | 'Destination';
}

function TokenSelector(props: PropTypes) {
  const { tokens, type } = props;

  return (
    <PageWithTextField
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Token`}
      Content={({ searchedText }) => (
        <TokenList
          searchedText={searchedText}
          tokens={tokens}
          selectedToken="BTC"
        />
      )}
    />
  );
}

export default TokenSelector;
