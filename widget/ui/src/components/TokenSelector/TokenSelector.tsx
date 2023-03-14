import React from 'react';
import { containsText } from '../../helper';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { TokenList } from '../TokenList';
import { TokenWithAmount } from '../TokenList/TokenList';

export interface PropTypes {
  list: TokenWithAmount[];
  type?: 'Source' | 'Destination';
  selected?: TokenWithAmount;
  onChange: (token: TokenWithAmount) => void;
  hasHeader?: boolean;
  multiSelect?: boolean;
  onBack?: () => void;
  selectedList?: TokenWithAmount[] | 'all';
}

const filterTokens = (list: TokenWithAmount[], searchedFor: string) =>
  list.filter(
    (token) =>
      containsText(token.symbol, searchedFor) ||
      containsText(token.address || '', searchedFor) ||
      containsText(token.name || '', searchedFor)
  );

export function TokenSelector(props: PropTypes) {
  const {
    list,
    type,
    selected,
    onChange,
    hasHeader,
    multiSelect,
    selectedList,
    onBack,
  } = props;

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
          list={filterTokens(list, searchedFor)}
          selected={selected}
          selectedList={selectedList}
          multiSelect={multiSelect}
          onChange={onChange}
        />
      )}
    />
  );
}
