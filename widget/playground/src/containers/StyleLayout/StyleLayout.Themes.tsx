import { ColorsIcon, Divider, Tabs, Typography } from '@rango-dev/ui';
import React, { useState } from 'react';

import { TABS } from '../../constants';
import { type Mode } from '../../store/config';

import { Preset } from './StyleLayout.Preset';
import { FieldTitle, GeneralContainer } from './StyleLayout.styles';

export function Themes() {
  const [tab, setTab] = useState<Mode>('auto');
  const onChangeMode = (mode: Mode) => {
    setTab(mode);
  };

  return (
    <>
      <GeneralContainer>
        <Tabs
          onChange={(item) => onChangeMode(item.id as Mode)}
          value={tab}
          items={TABS}
          type={'secondary'}
          borderRadius={'full'}
        />

        <Divider size={16} />
        <FieldTitle>
          <ColorsIcon size={18} color="gray" />
          <Divider direction="horizontal" size={4} />
          <Typography size="medium" variant="body">
            Presets
          </Typography>
        </FieldTitle>

        <Divider size={10} />
        <Preset tab={tab} />
      </GeneralContainer>
    </>
  );
}
