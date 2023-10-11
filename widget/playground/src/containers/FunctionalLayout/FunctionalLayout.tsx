import React, { useState } from 'react';

import { Collapse } from '../../components/Collapse';

import { Layout } from './FunctionalLayout.styles';
import { Wallets as WalletSection } from './FunctionalLayout.Wallets';

export function FunctionalLayout() {
  const [openCollapse, toggleCollapse] = useState(false);

  return (
    <Layout>
      <Collapse
        title="Wallet"
        open={openCollapse}
        toggle={() => toggleCollapse(!openCollapse)}>
        <WalletSection />
      </Collapse>
    </Layout>
  );
}
