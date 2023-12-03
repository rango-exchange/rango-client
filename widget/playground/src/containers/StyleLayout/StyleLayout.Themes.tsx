import type { Mode } from '../../store/config';

import { ColorsIcon, Divider, Typography } from '@rango-dev/ui';
import React, { useState } from 'react';

import { TABS } from '../../constants';

import { Preset } from './StyleLayout.Preset';
import {
  Field,
  FieldTitle,
  GeneralContainer,
  Tab,
  Tabs,
} from './StyleLayout.styles';

export function Themes() {
  const [tab, setTab] = useState<Mode>('auto');

  const onChangeMode = (mode: Mode) => {
    setTab(mode);
  };
  return (
    <>
      <GeneralContainer>
        <Field>
          <Tabs>
            {TABS.map((item) => (
              <Tab
                fullWidth
                key={item.id}
                type="secondary"
                onClick={() => onChangeMode(item.id)}
                size="small"
                variant={item.id === tab ? 'contained' : 'default'}>
                {item.title}
              </Tab>
            ))}
          </Tabs>
          <Divider size={16} />

          <FieldTitle>
            <ColorsIcon size={18} color="gray" />
            <Divider direction="horizontal" size={4} />
            <Typography size="medium" variant="body">
              Presets
            </Typography>
          </FieldTitle>

          <Divider size={12} />
          <Preset tab={tab} />
        </Field>
      </GeneralContainer>
    </>
  );
}
