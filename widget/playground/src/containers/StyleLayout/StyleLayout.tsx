import React, { useState } from 'react';

import { Collapse } from '../../components/Collapse';
import { FontSelector } from '../../components/FontSelector';
import { NextPage } from '../../components/NextPage';

import { General } from './StyleLayout.General';
import { Layout } from './StyleLayout.styles';

export function StyleLayout() {
  const [isFontPage, setIsFontPage] = useState(false);
  const [openCollapse, toggleCollapse] = useState(true);

  const onBack = () => setIsFontPage(false);

  return (
    <Layout>
      {isFontPage ? (
        <NextPage onBack={onBack}>
          <FontSelector onBack={onBack} />
        </NextPage>
      ) : (
        <Collapse
          title="General"
          open={openCollapse}
          toggle={() => toggleCollapse((prev) => !prev)}>
          <General setIsFontPage={setIsFontPage} />
        </Collapse>
      )}
    </Layout>
  );
}
