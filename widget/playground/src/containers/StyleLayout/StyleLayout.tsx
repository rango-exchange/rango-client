import React, { useState } from 'react';

import { Collapse } from '../../components/Collapse';

import { General } from './StyleLayout.General';
import { Layout } from './StyleLayout.styles';

export function StyleLayout() {
  const [openCollapse, toggleCollapse] = useState(true);

  return (
    <Layout>
      <Collapse
        title="General"
        open={openCollapse}
        toggle={() => toggleCollapse((prev) => !prev)}>
        <General />
      </Collapse>
    </Layout>
  );
}
