import type { PropTypes } from './Namespaces.types';
import type { Namespace } from '@rango-dev/wallets-shared';

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
import { namespaces } from '@rango-dev/wallets-shared';
import React, { useMemo, useState } from 'react';

import { useAppStore } from '../../store/AppStore';
import { WalletImageContainer } from '../HeaderButtons/HeaderButtons.styles';

import { LogoContainer, Spinner } from './ConnectStatus.styles';
import { getBlockchainLogo } from './Namespaces.helpers';
import { NamespaceList } from './Namespaces.styles';

export function Namespaces(props: PropTypes) {
  const { singleNamespace, availableNamespaces, providerImage } = props.value;

  const [selectedNamespaces, setSelectedNamespaces] = useState<Namespace[]>([]);

  const blockchains = useAppStore().blockchains();

  const namespacesInfo = useMemo(
    () =>
      availableNamespaces?.map((namespace) => ({
        name: namespace,
        logo: getBlockchainLogo(
          blockchains,
          namespaces[namespace].mainBlockchain
        ),
        title: namespaces[namespace].title,
      })),
    [availableNamespaces]
  );

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
            {namespacesInfo?.map((namespaceInfoItem) => (
              <ListItemButton
                key={namespaceInfoItem.name}
                id={namespaceInfoItem.name}
                title={namespaceInfoItem.title}
                hasDivider
                style={{ height: 60 }}
                onClick={() => onSelect(namespaceInfoItem.name)}
                start={<Image src={namespaceInfoItem.logo} size={22} />}
                end={
                  singleNamespace ? (
                    <Radio value={namespaceInfoItem.name} />
                  ) : (
                    <Checkbox
                      checked={selectedNamespaces.includes(
                        namespaceInfoItem.name
                      )}
                    />
                  )
                }
              />
            ))}
          </>
        )}
      </NamespaceList>
      <Button
        type="primary"
        disabled={!selectedNamespaces.length}
        onClick={() => props.onConfirm(selectedNamespaces)}>
        {i18n.t('Confirm')}
      </Button>
    </>
  );
}
