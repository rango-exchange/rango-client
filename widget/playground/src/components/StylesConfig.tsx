import {
  Button,
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
    name: 'primary',
    label: 'Primary',
  },
  {
    name: 'background',
    label: 'Background',
  },

  {
    name: 'foreground',
    label: 'Foreground',
  },

  {
    name: 'surface',
    label: 'Surface',
  },
  {
    name: 'neutrals',
    label: 'Neutrals',
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

const themes = [
  {
    dark: {
      foreground: '#fff',
      background: '#000',
      surface: '#000',
      primary: '#5FA425',
    },
    light: {
      background: '#fff',
      foreground: '#000',
      neutrals: '#fafafa',

      surface: '#fff',
      primary: '#5FA425',
      error: '#FF0000',
      warning: '#F5A623',
      success: '#0070F3',
    },
  },
  {
    dark: {
      primary: '#502f82ff',
      neutrals: '#24203dff',
      surface: '#24203dff',
      success: '#9b6de2ff',
    },
    light: {
      background: '#fcfaffff',
      primary: '#31007aff',
      foreground: '#120f29ff',
      surface: '#ffffffff',
      success: '#653ba3ff',
    },
  },
  {
    dark: {
      background: '#110114ff',
      success: '#9535bdff',
      surface: '#2d2a2dff',
      primary: '#d400cbff',
    },
    light: {
      background: '#fffeffff',
      primary: '#d400cbff',
      foreground: '#2f0146ff',
      success: '#9535bdff',
      surface: '#f5f1f7ff',
      neutrals: '#eae5eaff',
    },
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
const ModeContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  alignItems: 'center',
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

const Circle = styled('div', {
  width: 32,
  height: 32,
  borderRadius: 16,
});
export function StylesConfig() {
  // const width = useConfigStore.use.config().theme.width;
  // const height = useConfigStore.use.config().theme.height;
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const language = useConfigStore.use.config().language;
  const borderRadius = useConfigStore.use.config().theme.borderRadius;
  const theme = useConfigStore.use.config().theme.mode;
  const fontFamily = useConfigStore.use.config().theme.fontFamily;
  const colors = useConfigStore.use.config().theme.colors;

  const onChangelanguage = useConfigStore.use.onChangelanguage();
  const onChangeTheme = useConfigStore.use.onChangeTheme();
  const onChangeColors = useConfigStore.use.onChangeColors();
  const onSelectTheme = useConfigStore.use.onSelectTheme();

  const [checkedTheme, setChekedTheme] = useState<boolean>(true);

  return (
    <div>
      <Typography variant="h4">Style</Typography>

      <Spacer size={12} direction="vertical" />
      <ConfigurationContainer>
        <GridContent>
          <Select
            label="Choose Language Widget"
            value={language || 'Choose Language'}
            name="language"
            list={languageS}
            modalTitle="Languages"
            onChange={(_, value) => onChangelanguage(value)}
          />

          <Select
            label="Font Family"
            value={fontFamily || 'Choose Fontfamily'}
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
        <GridContent>
          {/* <div>
            <TextField
              size="large"
              onChange={(e) => onChangeTheme('width', parseInt(e.target.value))}
              name="width"
              value={width}
              label="Width"
              type="number"
              suffix="px"
            />
          </div> */}
          {/* <div>
            <TextField
              size="large"
              onChange={(e) => onChangeTheme('height', parseInt(e.target.value))}
              name="height"
              value={height}
              label="Height"
              type="number"
              suffix="px"
            />
          </div> */}
          <div>
            <TextField
              size="large"
              onChange={(e) => onChangeTheme('borderRadius', parseInt(e.target.value))}
              name="borderRadius"
              value={borderRadius}
              label="Border Radius"
              type="number"
              placeholder="0"
              suffix="px"
            />
          </div>
        </GridContent>
        <Spacer size={20} direction="vertical" />

        <hr />

        <Spacer size={24} direction="vertical" />
        <ModeContainer>
          <Button
            fullWidth
            onClick={() => setMode('light')}
            type="success"
            variant={mode === 'light' ? 'contained' : 'outlined'}>
            Light
          </Button>
          <Spacer size={24} direction="horizontal" />
          <Button
            fullWidth
            onClick={() => setMode('dark')}
            type="success"
            variant={mode === 'dark' ? 'contained' : 'outlined'}>
            Dark
          </Button>
        </ModeContainer>
        <Spacer size={24} direction="vertical" />

        <GridContent>
          {themes.map((theme) => (
            <Button type='success' variant="outlined" onClick={() => onSelectTheme(theme)}>
              <ModeContainer>
                <Circle
                  style={{
                    backgroundColor: theme.light.success,
                  }}
                />
                <Circle
                  style={{
                    backgroundColor: theme.light.foreground,
                    zIndex: 10,
                  }}
                />
                <Circle
                  style={{
                    backgroundColor: theme.light.primary,
                    position: 'absolute',
                  }}
                />
              </ModeContainer>
            </Button>
          ))}
        </GridContent>
        <Spacer size={24} direction="vertical" />

        <GridContent>
          {COLORS.map((color) => (
            <ColorPicker
              place="top"
              key={color.name}
              placeholder="Choose Color"
              color={colors[mode][color.name]}
              label={color.label}
              onChangeColor={(c) => onChangeColors(color.name as COLORS, mode, c)}
            />
          ))}
        </GridContent>
        <Spacer size={20} direction="vertical" />

        <Spacer size={24} direction="vertical" />
      </ConfigurationContainer>
    </div>
  );
}
