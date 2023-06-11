import React, { useMemo, useState } from 'react';
import { Button, Chip, CloseIcon, Modal } from '@rango-dev/ui';
import { Wallets } from '../../types';
import { WalletType } from '@rango-dev/wallets-shared';
import { Container } from './Container';
import ModalContent from './ModalContent';
import { useConfigStore } from '../../store/config';
import { allProviders } from '@rango-dev/provider-all';
import { ProviderInterface } from '@rango-dev/wallets-core';
const providers = allProviders();

type PropTypes = {
  list: Wallets;
};

export function ProvidersMultiSelect({ list }: PropTypes) {
  const [open, setOpen] = useState<boolean>(false);
  const wallets = useConfigStore.use.config().wallets;
  const onChangeWallets = useConfigStore.use.onChangeWallets();

  const value = wallets
    ?.filter((w) => typeof w !== 'string')
    .map((p) => (p as ProviderInterface).config.type);
  const onClickAction = () => {
    if (!value || !value?.length) onChangeWallets(providers);
    else onChangeWallets(undefined);
  };

  const onClose = () => {
    if (!value || !value.length) onChangeWallets(undefined);
    setOpen(false);
  };
  const onChange = (type: WalletType) => {
    let selectedWallets: (WalletType | ProviderInterface)[] = [
      ...(!wallets
        ? list
            .filter((item) => {
              return item.type !== type;
            })
            .map((item) => item.type)
        : wallets),
    ];

    const providerIndex = selectedWallets.findIndex(
      (w) => typeof w !== 'string' && w.config.type === type
    );
    if (providerIndex === -1) {
      const walletIndex = selectedWallets.findIndex(
        (w) => typeof w === 'string' && w === type
      );
      if (walletIndex !== -1) selectedWallets.splice(walletIndex, 1);

      const result = providers.find((provider) => {
        return provider.config.type === type;
      });
      if (!!result) selectedWallets = [...selectedWallets, result];
    } else if (providerIndex !== -1) {
      selectedWallets.splice(providerIndex, 1);
    }
    onChangeWallets(!selectedWallets.length ? undefined : selectedWallets);
  };
  return (
    <div>
      <Container label="External Wallets" onOpenModal={() => setOpen(true)}>
        {!value || !value.length ? (
          <Chip style={{ margin: 2 }} selected label="None Selected" />
        ) : (
          value.map((v: string, index: React.Key | null | undefined) => (
            <Chip
              style={{ margin: 2 }}
              selected
              label={v}
              suffix={<CloseIcon color="white" />}
              onClick={() => onChange(v)}
              key={index}
            />
          ))
        )}
      </Container>

      <Modal
        action={
          <Button type="primary" variant="ghost" onClick={onClickAction}>
            {!value || !value?.length ? 'Select All' : 'Deselect All'}
          </Button>
        }
        open={open}
        onClose={onClose}
        content={
          <ModalContent
            list={list}
            onChange={(item) => onChange(item.type)}
            selectedList={value || []}
            type={'Wallets'}
          />
        }
        title="Select Providers"
        containerStyle={{ width: '560px', height: '655px' }}
      />
    </div>
  );
}
