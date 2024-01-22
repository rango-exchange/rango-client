import { ColorsIcon, Divider, Typography } from '@rango-dev/ui';
import React, { useState } from 'react';

import { TABS } from '../../constants';
import { type Mode } from '../../store/config';

import { Preset } from './StyleLayout.Preset';
import {
  BackdropTab,
  FieldTitle,
  GeneralContainer,
  Tab,
  Tabs,
} from './StyleLayout.styles';

const TAB_WIDTH = 80;
export function Themes() {
  const [tab, setTab] = useState<Mode>('auto');
  const currentTabIndex = TABS.findIndex((mode) => mode.id === tab);
  const onChangeMode = (mode: Mode) => {
    setTab(mode);
  };

  return (
    <>
      <GeneralContainer>
        <Tabs>
          {TABS.map((item, index) => (
            <Tab
              fullWidth
              key={item.id}
              disableRipple={true}
              type="secondary"
              onClick={() => onChangeMode(item.id)}
              size="small"
              isActive={index === currentTabIndex}
              variant="default">
              {item.title}
            </Tab>
          ))}
          <BackdropTab
            css={{
              transform: `translateX(${TAB_WIDTH * currentTabIndex}px)`,
            }}
          />
        </Tabs>
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
