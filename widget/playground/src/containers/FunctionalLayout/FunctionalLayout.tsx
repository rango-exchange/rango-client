import type { WalletType } from '@rango-dev/wallets-shared';

import { useWallets } from '@rango-dev/wallets-react';
import { WalletTypes } from '@rango-dev/wallets-shared';
import React, { useState } from 'react';

import { Collapse } from '../../components/Collapse';
import { NextPage } from '../../components/NextPage';
import { SupportedWallets } from '../../components/SupportedWallets';
import { excludedWallets, getWalletNetworks } from '../../helpers';
import { useConfigStore } from '../../store/config';

import { Layout } from './FunctionalLayout.styles';
import { WalletSection } from './FunctionalLayout.Wallets';

export function FunctionalLayout() {
  const [openCollapse, toggleCollapse] = useState(true);
  const [isSupportedWalletModal, setIsSupportedWalletModal] = useState(false);
  const {
    config: { wallets },
  } = useConfigStore();
  const { getWalletInfo } = useWallets();
  const allWalletList = Object.values(WalletTypes)
    .filter((wallet) => !excludedWallets.includes(wallet))
    .map((type) => {
      const { name: title, img: logo, supportedChains } = getWalletInfo(type);
      return {
        title,
        logo,
        type,
        networks: getWalletNetworks(supportedChains),
      };
    });

  const onBack = () => {
    setIsSupportedWalletModal(false);
  };
  const onForward = () => {
    setIsSupportedWalletModal(true);
  };
  return (
    <Layout>
      {isSupportedWalletModal ? (
        <NextPage onBack={onBack}>
          <SupportedWallets
            onBack={onBack}
            configWallets={
              wallets || allWalletList.map((wallet) => wallet.type)
            }
            allWallets={allWalletList}
          />
        </NextPage>
      ) : (
        <Collapse
          title="Wallet"
          open={openCollapse}
          toggle={() => toggleCollapse(!openCollapse)}>
          <WalletSection
            onForward={onForward}
            value={
              wallets?.length === allWalletList.length
                ? undefined
                : (wallets as WalletType[])
            }
          />
        </Collapse>
      )}
    </Layout>
  );
}
