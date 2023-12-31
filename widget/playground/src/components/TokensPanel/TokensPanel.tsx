import type { PropTypes, TokenType } from './TokensPanel.types';
import type { Tokens } from '@rango-dev/widget-embedded';
import type { Asset } from 'rango-sdk';

import { ChainsIcon, Checkbox, Divider, Typography } from '@rango-dev/ui';
import React, { useState } from 'react';

import { tokensAreEqual } from '../../utils/common';
import {
  HeaderContainer,
  SelectButton,
  SelectDeselectText,
} from '../MultiList/MultiList.styles';
import { StyledButton } from '../SingleList/SingleList.styles';

import { BlockchainChip } from './TokensPanel.Chip';
import { TokensList } from './TokensPanel.List';
import { BlockchainsList } from './TokensPanel.styles';

function getItemCountLabel(chain: string, list: TokenType[]) {
  const filteredList = list.filter((item) => item.blockchain === chain);
  const checkedCount = filteredList.filter((item) => item.checked).length;
  return filteredList.length === checkedCount ? 'All' : checkedCount;
}

export function TokensPanel(props: PropTypes) {
  const {
    list: listProps,
    selectedBlockchains: selectedBlockchainsProps,
    onChange,
    tokensConfig,
  } = props;
  const [selectedBlockchain, setSelectedBlockchain] = useState(
    selectedBlockchainsProps[0]
  );

  const [list, setList] = useState(listProps);

  const [supportedTokenList, setSupportedTokenList] = useState(
    tokensConfig || {}
  );
  const [showSelectedTokens, setShowSelectedTokens] = useState(false);

  const getTokens = (
    selected: boolean,
    allTokensInBlockchain: Asset[],
    token?: TokenType
  ) => {
    if (!token) {
      return selected ? allTokensInBlockchain : [];
    }
    const { blockchain, symbol, address } = token;
    if (!selected) {
      return [
        ...supportedTokenList[blockchain].tokens.filter(
          (t) => !tokensAreEqual(t, token)
        ),
      ];
    }
    return [
      ...supportedTokenList[blockchain].tokens,
      { symbol, address, blockchain },
    ];
  };

  /*
   * This function is designed to operate in two scenarios:
   *
   * 1. Activating the checkbox by clicking on it.
   * 2. Choosing "Select All" for each blockchain.
   *
   *  If the token has been dispatched, it indicates that the checkbox has been selected.
   * Conversely, if the token has not been dispatched, it implies that another one option has been chosen.
   * The resulting output fulfills our configuration requirements.
   */

  const makeSupportedTokenList = (
    blockchain: string,
    tokens: {
      [blockchain: string]: Tokens;
    },
    selected: boolean,
    token?: TokenType
  ) => {
    const allTokensInBlockchain = list
      .filter((item) => item.blockchain === blockchain)
      .map(({ symbol, blockchain, address }) => ({
        symbol,
        blockchain,
        address,
      }));
    if (supportedTokenList[blockchain]) {
      const blockchainTokens = supportedTokenList[blockchain].tokens;
      if (!supportedTokenList[blockchain].isExcluded) {
        /*
         * This condition is for when the select option is true and show that all tokens have been selected.
         *  If there is a token, it means that one token has been added to the rest of the tokens, so its lenght is equal to all the tokens of that blockchain.
         *  If there is no token, it means that select all is selected done
         */
        if (
          selected &&
          (blockchainTokens.length + 1 === allTokensInBlockchain.length ||
            !token)
        ) {
          const { [blockchain]: deletedKey, ...otherKeys } = tokens;
          return otherKeys;
        }
      }

      return {
        ...tokens,
        [blockchain]: {
          ...tokens[blockchain],
          tokens: getTokens(selected, allTokensInBlockchain, token),
        },
      };
    }

    return {
      ...tokens,
      [blockchain]: {
        isExcluded: false,
        tokens:
          !token && !selected
            ? []
            : allTokensInBlockchain.filter((t) => !tokensAreEqual(t, token)),
      },
    };
  };

  const handleChange = (token: TokenType, type: 'checked' | 'pinned') => {
    if (type === 'checked') {
      setSupportedTokenList(
        makeSupportedTokenList(
          selectedBlockchain,
          supportedTokenList,
          !token.checked,
          token
        )
      );
    }
    setList((prev) =>
      prev.map((item) => {
        if (tokensAreEqual(token, item)) {
          const pinnedValue =
            type === 'checked' && item.checked ? { pinned: false } : {};
          return { ...item, ...pinnedValue, [type]: !item[type] };
        }
        return item;
      })
    );
  };

  const handleSelectDeselectInBlockchain = (selected: boolean) => {
    const tokenList = {
      ...makeSupportedTokenList(
        selectedBlockchain,
        supportedTokenList,
        selected
      ),
    };

    setSupportedTokenList(tokenList);

    setList((prev) =>
      prev.map((item) => {
        if (item.blockchain === selectedBlockchain) {
          return { ...item, checked: selected };
        }
        return item;
      })
    );
  };
  const notAllTokensSelected = list.some((item) => !item.checked);

  const handleResetTokens = () => {
    if (notAllTokensSelected) {
      setSupportedTokenList({});
      setList((prev) =>
        prev.map((item) => {
          return { ...item, checked: true };
        })
      );
    }
  };

  const handleConfirmAllList = () => {
    const allPinned = list.filter((item) => item.pinned);
    onChange(
      supportedTokenList && !Object.keys(supportedTokenList).length
        ? undefined
        : supportedTokenList,
      allPinned
    );
  };

  const onExcludedChange = () => {
    const allTokensInBlockchain = list.filter(
      (item) => selectedBlockchain === item.blockchain
    );
    const tokenList = {
      ...supportedTokenList,
      [selectedBlockchain]: {
        isExcluded: supportedTokenList[selectedBlockchain]
          ? !supportedTokenList[selectedBlockchain].isExcluded
          : true,
        tokens: allTokensInBlockchain
          .filter((t) => !t.checked)
          .map(({ symbol, blockchain, address }) => ({
            symbol,
            blockchain,
            address,
          })),
      },
    };
    setList((prev) =>
      prev.map((item) => {
        if (item.blockchain === selectedBlockchain) {
          return { ...item, checked: !item.checked };
        }
        return item;
      })
    );
    setSupportedTokenList(tokenList);
  };

  return (
    <>
      <HeaderContainer>
        <div className="header">
          <ChainsIcon size={24} />
          <Divider direction="horizontal" size={4} />
          <Typography size="medium" variant="body">
            Supported Tokens
          </Typography>
        </div>
        <SelectButton onClick={handleResetTokens}>
          <SelectDeselectText
            variant="label"
            size="medium"
            disabled={!notAllTokensSelected}
            color={notAllTokensSelected ? 'neutral900' : 'neutral600'}>
            Reset Tokens
          </SelectDeselectText>
        </SelectButton>
      </HeaderContainer>
      <Divider size={4} />
      <BlockchainsList>
        {selectedBlockchainsProps.map((chain) => (
          <BlockchainChip
            key={chain}
            label={chain}
            itemCountLabel={getItemCountLabel(chain, list)}
            onClick={() => setSelectedBlockchain(chain)}
            isSelected={chain === selectedBlockchain}
          />
        ))}
      </BlockchainsList>
      <Divider size={20} />
      <Checkbox
        id="new-source"
        onCheckedChange={onExcludedChange}
        checked={
          supportedTokenList && supportedTokenList[selectedBlockchain]
            ? supportedTokenList[selectedBlockchain].isExcluded
            : false
        }
        label={
          <Typography size="medium" variant="body">
            Exclude {selectedBlockchain} Tokens
          </Typography>
        }
      />
      <Divider size={20} />
      <TokensList
        list={list.filter((token) => token.blockchain === selectedBlockchain)}
        onChange={handleChange}
        isExcluded={supportedTokenList[selectedBlockchain]?.isExcluded || false}
        setShowSelectedTokens={setShowSelectedTokens}
        showSelectedTokens={showSelectedTokens}
        isAllSelected={getItemCountLabel(selectedBlockchain, list) === 'All'}
        onChangeAll={handleSelectDeselectInBlockchain}
      />
      <Divider size={32} />
      <StyledButton
        type="primary"
        size="medium"
        variant="contained"
        disabled={!list.find((item) => item.checked)}
        onClick={handleConfirmAllList}>
        Confirm
      </StyledButton>
    </>
  );
}
