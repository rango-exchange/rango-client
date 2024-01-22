import { Divider } from '@rango-dev/ui';
import React, { useState } from 'react';

import { Collapse } from '../../components/Collapse';

import { FromSection } from './FunctionalLayout.From';
import { LiquiditiesSection } from './FunctionalLayout.Liquidities';
import { ToSection } from './FunctionalLayout.To';
import { FunctionalCollapseState } from './FunctionalLayout.types';
import { WalletSection } from './FunctionalLayout.Wallets';

export function FunctionalLayout() {
  const [openCollapse, toggleCollapse] =
    useState<FunctionalCollapseState | null>(FunctionalCollapseState.FROM);

  const handleOpenCollapse = (name: FunctionalCollapseState) => () => {
    if (openCollapse === name) {
      toggleCollapse(null);
    } else {
      toggleCollapse(name);
    }
  };

  return (
    <div>
      <Collapse
        title={FunctionalCollapseState.FROM}
        open={openCollapse === FunctionalCollapseState.FROM}
        toggle={handleOpenCollapse(FunctionalCollapseState.FROM)}>
        <FromSection />
      </Collapse>
      <Divider size={16} />
      <Collapse
        title={FunctionalCollapseState.TO}
        open={openCollapse === FunctionalCollapseState.TO}
        toggle={handleOpenCollapse(FunctionalCollapseState.TO)}>
        <ToSection />
      </Collapse>
      <Divider size={16} />
      <Collapse
        title={FunctionalCollapseState.WALLET}
        open={openCollapse === FunctionalCollapseState.WALLET}
        toggle={handleOpenCollapse(FunctionalCollapseState.WALLET)}>
        <WalletSection />
      </Collapse>
      <Divider size={16} />
      <Collapse
        title={FunctionalCollapseState.LIQUIDITY_SOURCE}
        open={openCollapse === FunctionalCollapseState.LIQUIDITY_SOURCE}
        toggle={handleOpenCollapse(FunctionalCollapseState.LIQUIDITY_SOURCE)}>
        <LiquiditiesSection />
      </Collapse>
    </div>
  );
}
