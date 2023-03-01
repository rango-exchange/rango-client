import React from 'react';
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
      hasHeader={hasHeader}
      title={`Select ${type} Token`}
      onBack={onBack}
      Content={({ searchedFor }) => (
        <TokenList
          searchedText={searchedFor}
          list={list}
          selected={selected}
          selectedList={selectedList}
          multiSelect={multiSelect}
          onChange={onChange}
        />
      )}
    />
  );
}
