/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Mode } from '../../store/config';

import {
  ChevronDownIcon,
  ColorsIcon,
  CustomColorsIcon,
  Divider,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { TABS } from '../../constants';

import { Preset } from './StyleLayout.Preset';
import {
  CustomColors,
  Field,
  FieldTitle,
  GeneralContainer,
  Line,
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
          <Divider size={16} />
          <Line />
          <Divider size={4} />

          <CustomColors
            variant="default"
            fullWidth
            suffix={<ChevronDownIcon size={10} color="gray" />}>
            <FieldTitle>
              <CustomColorsIcon size={18} color="gray" />
              <Divider direction="horizontal" size={4} />
              <Typography size="medium" variant="body" className="title">
                Custom Colors
              </Typography>
            </FieldTitle>
          </CustomColors>
        </Field>
      </GeneralContainer>
    </>
  );
}
