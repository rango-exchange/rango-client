import {
  Checkbox,
  ColorPicker,
  Spacer,
  styled,
  Switch,
  TextField,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';
import { languageS, FONTS } from '../constants';
import { COLORS, useConfigStore } from '../store/config';
import { ConfigurationContainer } from './ChainsConfig';
import { Select } from './Select';

const COLORS = [
  {
    name: 'background',
    label: 'Background',
  },
  {
    name: 'primary',
    label: 'Primary Color',
  },

  {
    name: 'foreground',
    label: 'Foreground Color',
  },
  {
    name: 'success',
    label: 'Success',
  },
  {
    name: 'error',
    label: 'Error',
  },
  {
    name: 'warning',
    label: 'Warning',
  },
];
const GridContent = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
  '@md': {
    gridTemplateColumns: '1fr 1fr',
  },
  '@lg': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
});

const ThemeContainer = styled('div', {
  borderColor: '$neutrals600',
  color: '$neutrals500',
  border: '1px solid',
  height: '$48',
  borderRadius: '$5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
const Line = styled('div', {
  height: '100%',
  width: 1,
  backgroundColor: '$foreground',
});
export function StylesConfig() {
  const width = useConfigStore.use.config().theme.width;
  const height = useConfigStore.use.config().theme.height;
  const language = useConfigStore.use.config().language;
  const borderRadius = useConfigStore.use.config().theme.borderRadius;
  const theme = useConfigStore.use.config().theme.mode;
  const fontFamily = useConfigStore.use.config().theme.fontFamily;
  const colors = useConfigStore.use.config().theme.colors;

  const onChangelanguage = useConfigStore.use.onChangelanguage();
  const onChangeTheme = useConfigStore.use.onChangeTheme();
  const onChangeColors = useConfigStore.use.onChangeColors();

  const [checkedTheme, setChekedTheme] = useState<boolean>(true);
  return (
    <div>
      <Typography variant="h4">Style</Typography>

      <Spacer size={12} direction="vertical" />
      <ConfigurationContainer>
        <GridContent>
          <div>
            <TextField
              size="large"
              onChange={(e) => onChangeTheme('width', parseInt(e.target.value))}
              name="width"
              value={width}
              label="Width"
              type="number"
              suffix="px"
            />
          </div>
          <div>
            <TextField
              size="large"
              onChange={(e) => onChangeTheme('height', parseInt(e.target.value))}
              name="height"
              value={height}
              label="Height"
              type="number"
              suffix="px"
            />
          </div>
          <div>
            <TextField
              size="large"
              onChange={(e) => onChangeTheme('borderRadius', parseInt(e.target.value))}
              name="borderRadius"
              value={borderRadius}
              label="Border Radius"
              type="number"
              suffix="px"
            />
          </div>
        </GridContent>
        <Spacer size={20} direction="vertical" />

        <GridContent>
          <Select
            label="Choose Language Widget"
            value={language}
            name="language"
            list={languageS}
            modalTitle="Languages"
            onChange={(_, value) => onChangelanguage(value)}
          />

          <Select
            label="Font Family"
            value={fontFamily}
            name="fontFamily"
            list={FONTS}
            modalTitle="Fonts"
            onChange={(_, value) => onChangeTheme('fontFamily', value)}
          />
          <div>
            <Typography variant="body2" mb={4}>
              Theme
            </Typography>
            <ThemeContainer>
              <Checkbox
                checked={checkedTheme}
                id={'auto'}
                label={'Auto'}
                onCheckedChange={(checked) => {
                  if (checked) onChangeTheme('mode', 'auto');
                  else onChangeTheme('mode', 'light');
                  setChekedTheme(checked);
                }}
              />
              <Spacer size={12} />
              <Line />
              <Spacer size={12} />
              <Typography variant="caption" mr={4}>
                Light
              </Typography>
              <Switch
                checked={theme === 'dark'}
                onChange={(checked) => {
                  if (!checkedTheme) {
                    let theme;
                    if (checked) theme = 'dark';
                    else theme = 'light';
                    onChangeTheme('mode', theme);
                  }
                }}
              />
              <Typography variant="caption" ml={4}>
                Dark
              </Typography>
            </ThemeContainer>
          </div>
        </GridContent>
        <Spacer size={24} direction="vertical" />

        <hr />
        <Spacer size={24} direction="vertical" />

        <GridContent>
          {COLORS.map((color) => (
            <ColorPicker
              place="top"
              key={color.name}
              color={colors[color.name]}
              label={color.label}
              onChangeColor={(c) => onChangeColors(color.name as COLORS, c.hex)}
            />
          ))}
        </GridContent>
        <Spacer size={24} direction="vertical" />
      </ConfigurationContainer>
    </div>
  );
}
