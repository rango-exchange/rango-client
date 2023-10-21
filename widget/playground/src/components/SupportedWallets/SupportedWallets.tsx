import type { PropTypes } from './SupportedWallets.types';
import type { WalletTypes } from '@rango-dev/wallets-shared';

import {
  Button,
  Checkbox,
  CloseIcon,
  Divider,
  IconButton,
  Image,
  ListItemButton,
  SearchIcon,
  SelectableCategoryList,
  TextField,
  Typography,
  WalletIcon,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { useConfigStore } from '../../store/config';
import { useMetaStore } from '../../store/meta';
import { StyledButton } from '../SingleList/SingleList.styles';

import {
  HeaderContainer,
  IconWrapper,
  SelectButton,
  WalletDivider,
  WalletList,
} from './SupportedWallets.styles';

export function SupportedWallets(props: PropTypes) {
  const { onBack, configWallets, allWallets } = props;
  const [category, setCategory] = useState<string>('ALL');
  const [searchValue, setSearchValue] = useState('');
  const [selectedWallets, setSelectedWallets] = useState(configWallets || []);
  const { blockchains } = useMetaStore.use.meta();
  const onChangeWallets = useConfigStore.use.onChangeWallets();
  const filteredList = searchValue
    ? allWallets.filter((w) =>
        w.title.toLowerCase().includes(searchValue.toLowerCase())
      )
    : allWallets;
  const walletsList =
    category === 'ALL'
      ? filteredList
      : filteredList.filter((wallet) => wallet.networks.includes(category));
  const onChangeWallet = (wallet: WalletTypes) => {
    const list = [...selectedWallets];
    const isAlreadyExist = list.includes(wallet);
    if (isAlreadyExist) {
      const filteredList = list.filter((w) => w !== wallet);
      setSelectedWallets(filteredList);
    } else {
      const newList = [...list, wallet];
      setSelectedWallets(newList);
    }
  };

  const allSelectedClick = () => {
    if (selectedWallets.length === allWallets.length) {
      setSelectedWallets([]);
    } else {
      setSelectedWallets(allWallets.map((wallet) => wallet.type));
    }
  };

  const handleConfirm = () => {
    onChangeWallets(
      selectedWallets.length === allWallets.length ? undefined : selectedWallets
    );
    onBack();
  };

  const list = walletsList.map((wallet) => {
    const { logo, title, type } = wallet;
    return {
      start: <Image src={logo} size={16} type="circular" />,
      onClick: () => onChangeWallet(type),
      end: <Checkbox checked={selectedWallets.includes(type)} />,
      title: (
        <Typography variant="title" size="xmedium">
          {title}
        </Typography>
      ),
      id: title,
    };
  });

  return (
    <>
      <HeaderContainer>
        <div className="header">
          <WalletIcon size={18} />
          <Divider direction="horizontal" size={4} />
          <Typography size="medium" variant="body">
            Supported Wallet
          </Typography>
        </div>
        <Typography size="medium" variant="body">
          {`${selectedWallets.length}/${allWallets.length}`}
        </Typography>
      </HeaderContainer>
      <Divider size={20} />
      <SelectableCategoryList
        blockchains={blockchains}
        category={category}
        setCategory={setCategory}
      />
      <Divider size={20} />
      <TextField
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        variant="contained"
        placeholder="Search Wallets"
        prefix={
          <IconWrapper>
            <SearchIcon color="gray" />
          </IconWrapper>
        }
        suffix={
          <IconButton
            variant="ghost"
            onClick={() => setSearchValue('')}
            size="small">
            {!!searchValue.length && <CloseIcon color="gray" size={10} />}
          </IconButton>
        }
        style={{
          padding: 10,
          borderRadius: 25,
          alignItems: 'center',
        }}
      />
      <Divider size={12} />
      <SelectButton>
        <Button variant="ghost" size="xsmall" onClick={allSelectedClick}>
          {selectedWallets.length === allWallets.length
            ? 'Deselect all'
            : 'Select all'}
        </Button>
      </SelectButton>
      <Divider size={12} />
      <WalletList>
        {list.map((wallet) => {
          return (
            <React.Fragment key={wallet.id}>
              <ListItemButton style={{ height: '46px' }} {...wallet} />
              <WalletDivider />
            </React.Fragment>
          );
        })}
      </WalletList>
      <Divider size={32} />
      <Divider size={32} />
      <StyledButton
        type="primary"
        size="medium"
        variant="contained"
        onClick={handleConfirm}>
        Confirm
      </StyledButton>
    </>
  );
}
