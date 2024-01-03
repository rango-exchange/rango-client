import { Divider } from '@rango-dev/ui';
import React, { useState } from 'react';

import { Collapse } from '../../components/Collapse';

import { General } from './StyleLayout.General';
import { Themes } from './StyleLayout.Themes';
import { StyleCollapseState } from './StyleLayout.types';

export function StyleLayout() {
  const [openCollapse, toggleCollapse] = useState<StyleCollapseState | null>(
    StyleCollapseState.GENERAL
  );
  const handleOpenCollapse = (name: StyleCollapseState) => () => {
    if (openCollapse === name) {
      toggleCollapse(null);
    } else {
      toggleCollapse(name);
    }
  };
  return (
    <div>
      <Collapse
        title={StyleCollapseState.GENERAL}
        open={openCollapse === StyleCollapseState.GENERAL}
        toggle={handleOpenCollapse(StyleCollapseState.GENERAL)}>
        <General />
      </Collapse>
      <Divider size={16} />
      <Collapse
        title={StyleCollapseState.THEMES}
        open={openCollapse === StyleCollapseState.THEMES}
        toggle={handleOpenCollapse(StyleCollapseState.THEMES)}>
        <Themes />
      </Collapse>
    </div>
  );
}
