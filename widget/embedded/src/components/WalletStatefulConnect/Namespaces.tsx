import type { PropTypes } from './Namespaces.types';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

import { i18n } from '@lingui/core';
import {
  Button,
  Checkbox,
  Divider,
  Image,
  ListItemButton,
  MessageBox,
  Radio,
  RadioRoot,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { useAppStore } from '../../store/AppStore';
import { WalletImageContainer } from '../HeaderButtons/HeaderButtons.styles';

import { LogoContainer, Spinner } from './ConnectStatus.styles';
import { getBlockchainLogo } from './Namespaces.helpers';
import { NamespaceList } from './Namespaces.styles';

export function Namespaces(props: PropTypes) {
  const { targetWallet } = props.value;
  const singleNamespace = targetWallet.needsNamespace?.selection === 'single';
  const providerImage = targetWallet.image;

  const [selectedNamespaces, setSelectedNamespaces] = useState<Namespace[]>([]);

  const blockchains = useAppStore().blockchains();

  const onSelect = (namespace: Namespace) => {
    if (singleNamespace) {
      setSelectedNamespaces([namespace]);
    } else {
      setSelectedNamespaces((selectedNamespaces) =>
        selectedNamespaces.includes(namespace)
          ? selectedNamespaces.filter((item) => item !== namespace)
          : selectedNamespaces.concat(namespace)
      );
    }
  };

  const wrapRadioRoot = (children: React.ReactNode) => {
    if (singleNamespace) {
      return <RadioRoot value={selectedNamespaces?.[0]}>{children}</RadioRoot>;
    }

    return <>{children}</>;
  };

  return (
    <>
      <Divider size={20} />
      <MessageBox
        type="info"
        title={i18n.t('Select chain types')}
        description={i18n.t(
          `This wallet supports multiple chains. Select which chain you'd like to connect to.`
        )}
        icon={
          <LogoContainer>
            <WalletImageContainer>
              <Image src={providerImage} size={45} />
            </WalletImageContainer>
            <Spinner />
          </LogoContainer>
        }
      />
      <NamespaceList>
        {wrapRadioRoot(
          <>
            {targetWallet.needsNamespace?.data.map((ns) => {
              return (
                <ListItemButton
                  key={ns.id}
                  id={ns.id}
                  title={ns.label}
                  hasDivider
                  style={{ height: 60 }}
                  onClick={() => onSelect(ns.value)}
                  start={
                    <Image
                      src={getBlockchainLogo(blockchains, ns.id)}
                      size={22}
                    />
                  }
                  end={
                    singleNamespace ? (
                      <Radio value={ns.value} />
                    ) : (
                      <Checkbox
                        checked={selectedNamespaces.includes(ns.value)}
                      />
                    )
                  }
                />
              );
            })}
          </>
        )}
      </NamespaceList>
      <Button
        id="widget-name-space-confirm-btn"
        type="primary"
        disabled={!selectedNamespaces.length}
        onClick={() => props.onConfirm(selectedNamespaces)}>
        {i18n.t('Confirm')}
      </Button>
    </>
  );
}
