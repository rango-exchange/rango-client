import { ColorsIcon, Divider, Tabs, Typography } from '@arlert-dev/ui';
import React, { useEffect, useState } from 'react';

import { TABS } from '../../constants';
import { type Mode, useConfigStore } from '../../store/config';

import { Preset } from './StyleLayout.Preset';
import { FieldTitle, GeneralContainer } from './StyleLayout.styles';

export function Themes() {
  const { theme } = useConfigStore.use.config();

  const [tab, setTab] = useState<Mode>(theme?.mode || 'auto');
  const onChangeMode = (mode: Mode) => {
    setTab(mode);
  };

  useEffect(() => {
    if (theme?.colors?.light && theme?.colors?.dark) {
      setTab('auto');
    }
  }, [theme?.colors]);

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
