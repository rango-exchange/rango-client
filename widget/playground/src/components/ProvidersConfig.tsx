import React, { useEffect, useState } from 'react';
import {
  Button,
  ConnectWalletsModal,
  Divider,
  InfoCircleIcon,
  Modal,
  Switch,
  Typography,
  styled,
} from '@rango-dev/ui';
import { useWallets, WalletProvider } from '@rango-dev/wallets-core';
import { useConfigStore } from '../store/config';
import { ConfigurationContainer } from './ChainsConfig';
import { allProviders } from '@rango-dev/provider-all';
import { WalletType } from '@rango-dev/wallets-shared';
import { useMetaStore } from '../store/meta';
import ModalContent from './MultiSelect/ModalContent';
import { getStateWallet, onChangeMultiSelects } from '../helpers';
import { useExternalProvidersStore } from '../store/externalProviders';

const Head = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid $neutral100',
  paddingBottom: '$8',
});

const Body = styled('div', {
  maxHeight: 150,
  overflow: 'hidden auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export function ProvidersConfig() {
  const [hasExternalProvider, setHasExternalProvider] = useState<boolean>(false);
  const [openProviderModal, setOpenProviderModal] = useState<boolean>(false);
  const [openWalletsModal, setOpenWalletsModal] = useState<boolean>(false);
  const loadingStatus = useMetaStore.use.loadingStatus();
  const selectedWallets = useConfigStore.use.config().wallets;
  const [walletMessage, setWalletErrorMessage] = useState('');

  const walletsContext = useWallets();

  const external = useExternalProvidersStore.use.external();
  const onChangeProviders = useExternalProvidersStore.use.onChangeProviders();
  const onChangeManageExternalproviders =
    useExternalProvidersStore.use.onChangeManageExternalproviders();

  const providersList = allProviders();

  const list = providersList.map((provider: WalletProvider) => {
    const { name: title, img: logo } = walletsContext.getWalletInfo(provider.config.type);
    return {
      title,
      logo,
      type: provider.config.type,
    };
  });

  const selectedProviders = external.providers?.map(
    (provider: WalletProvider) => provider.config.type,
  );

  const wallets = (external.providers || providersList)
    .map((provider: WalletProvider) => {
      const type = provider.config.type;
      const { name, img: image, installLink, showOnMobile } = walletsContext.getWalletInfo(type);
      return {
        state: getStateWallet(walletsContext.state(type)),
        installLink,
        name,
        image,
        type,
        showOnMobile: !!showOnMobile,
      };
    })
    .filter((w) => {
      const type = w.type;
      return !!selectedWallets ? selectedWallets.find((w) => w === type) : w;
    });

  const onChange = (provider) => {
    const list = providersList.map((item) => item.config.type);
    const selected = external.providers?.map((item) => item.config.type);
    let values = onChangeMultiSelects(provider, selected, list, (item) => item === provider);
    if (values)
      values = allProviders().filter((provider) => {
        const type = provider.config.type;
        return values.find((w) => w === type);
      });
    onChangeProviders(values);
  };

  const onClickAction = () => {
    if (!external.providers) onChange('empty');
    else onChange('all');
  };

  const onSelectWallet = async (type: WalletType) => {
    const wallet = walletsContext.state(type);
    try {
      if (wallet.connected) {
        await walletsContext.disconnect(type);
      } else {
        await walletsContext.connect(type);
      }
    } catch (e) {
      if (e instanceof Error) {
        setWalletErrorMessage('Error: ' + e.message);
      }
    }
  };

  return (
    <>
      <Typography variant="h6">Providers</Typography>
      <Divider size={12} />
      <ConfigurationContainer>
        <Head>
          <Typography noWrap variant="body2" color="neutral700">
            External Providers
          </Typography>

          <Switch
            checked={hasExternalProvider}
            onChange={(checked) => {
              if (!checked) {
                onChangeProviders(undefined);
                onChangeManageExternalproviders(undefined);
              } else {
                onChangeProviders(providersList);
                onChangeManageExternalproviders(walletsContext);
              }
              setHasExternalProvider(checked);
            }}
          />
        </Head>
        <Divider size={16} />
        <Body>
          <Button
            onClick={() => setOpenProviderModal(!openProviderModal)}
            variant="contained"
            fullWidth
            loading={loadingStatus === 'loading'}
            disabled={loadingStatus === 'failed' || !hasExternalProvider}
            size="small"
            suffix={loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
            type="success">
            Select External Providers
          </Button>
          <Divider direction="horizontal" />
          <Button
            onClick={() => setOpenWalletsModal(!openWalletsModal)}
            variant="contained"
            fullWidth
            loading={loadingStatus === 'loading'}
            disabled={loadingStatus === 'failed' || !hasExternalProvider}
            size="small"
            suffix={loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
            type="success">
            Connect/Disconnect To External Providers
          </Button>
        </Body>
        <ConnectWalletsModal
          list={wallets}
          open={openWalletsModal}
          onClose={() => {
            setOpenWalletsModal(false);
          }}
          onSelect={onSelectWallet}
          error={walletMessage}
        />

        <Modal
          action={
            <Button type="primary" variant="ghost" onClick={onClickAction}>
              {!selectedProviders ? 'Deselect All' : 'Select All'}
            </Button>
          }
          open={openProviderModal}
          onClose={() => {
            if (!external.providers || !external.providers.length) onChange('all');
            setOpenProviderModal(false);
          }}
          content={
            <ModalContent
              list={list}
              onChange={(item) => onChange(item.type)}
              selectedList={selectedProviders}
              type={'Wallets'}
            />
          }
          title={'External Providers'}
          containerStyle={{ width: '560px', height: '655px' }}
        />
      </ConfigurationContainer>
    </>
  );
}
