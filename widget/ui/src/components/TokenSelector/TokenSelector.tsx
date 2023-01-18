import React from 'react';
import { TokenMeta } from '../../types/meta';
import SecondaryPage from '../PageWithTextField/SecondaryPage';
import TokenList from '../TokenList';

export interface PropTypes {
  tokens: TokenMeta[];
  type: 'Source' | 'Destination';
  selectedToken: TokenMeta;
  onSelectedBlockchainChanged: (token: TokenMeta) => void;
}

function TokenSelector(props: PropTypes) {
  const { tokens, type, selectedToken, onSelectedBlockchainChanged } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Token`}
      Content={({ searchedText }) => (
        <TokenList
          searchedText={searchedText}
          tokens={tokens}
          selectedToken={selectedToken}
          onSelectedTokenChanged={onSelectedBlockchainChanged}
        />
      )}
    />
  );
}

export default TokenSelector;
