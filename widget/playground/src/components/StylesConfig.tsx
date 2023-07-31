import {
  Button,
  Checkbox,
  ColorPicker,
  Divider,
  styled,
  Switch,
  TextField,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';
import { FONTS } from '../constants';
import { COLORS, Mode, useConfigStore } from '../store/config';
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
    name: 'neutral',
    label: 'Neutral',
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

const customThemes = [
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
      neutral: '#fafafa',

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
      neutral: '#24203dff',
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
      neutral: '#eae5eaff',
    },
  },
  {
    dark: {
      primary: '#353038ff',
      neutral: '#353038ff',
      surface: '#353038ff',
      success: '#ef1cffff',
      background: '#252028ff',
      foreground: '#88818cff',
    },
  },
  {
    dark: {
      foreground: '#fff',
      background: '#171721ff',
      surface: '#1c1c28ff',
      primary: '#7720e9ff',
      neutral: '#1c1c28ff',
      success: '#c193fdff',
    },
    light: {
      background: '#fff',
      foreground: '#171721ff',
      neutral: '#f9fafbff',
      surface: '#f9fafbff',
      primary: '#7f1fffff',
      success: '#7f1fffff',
    },
  },
  {
    dark: {
      background: '#0c1536ff',
      primary: '#6c5be0ff',
      foreground: '#c4d1fdff',
      success: '#4030faff',
      surface: '#13164eff',
      neutral: '#181c63ff',
    },
  },
  {
    dark: {
      background: '#0c0f12ff',
      primary: '#e0c072ff',
      foreground: '#e0c072ff',
      success: '#e9dcbeff',
      surface: '#12171cff',
      neutral: '#202327ff',
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
  borderColor: '$neutral600',
  color: '$neutral500',
  border: '1px solid',
  height: '$48',
  borderRadius: '$5',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
});

const ThemeSwitchAndLables = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const ThemeSwitchContainer = styled('div', {
  padding: '0 $16',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '@lg': {
    padding: '0',
  },
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

const FieldName = styled(Typography, {
  color: '$neutral700',
});

const defaultColors = {
  dark: {
    foreground: '#fff',
    background: '#000',
    surface: '#000',
    primary: '#5FA425',
    error: '#FF0000',
    warning: '#F5A623',
    success: '#0070F3',
  },
  light: {
    background: '#fff',
    foreground: '#000',
    neutral: '#fafafa',
    surface: '#fff',
    primary: '#5FA425',
    error: '#FF0000',
    warning: '#F5A623',
    success: '#0070F3',
  },
};
export function StylesConfig() {
  // const language = useConfigStore.use.config().language;
  const borderRadius = useConfigStore.use.config().theme?.borderRadius;
  const theme = useConfigStore.use.config().theme?.mode;
  const fontFamily = useConfigStore.use.config().theme?.fontFamily;
  const colors = useConfigStore.use.config().theme?.colors;
  const singleTheme = useConfigStore.use.config().theme?.singleTheme;

  const [mode, setMode] = useState<'light' | 'dark'>(
    !theme || theme === 'auto' ? 'light' : theme
  );
  // const onChangelanguage = useConfigStore.use.onChangelanguage();
  const onChangeTheme = useConfigStore.use.onChangeTheme();
  const onChangeColors = useConfigStore.use.onChangeColors();
  const onSelectTheme = useConfigStore.use.onSelectTheme();

  const [checkedTheme, setChekedTheme] = useState<boolean>(true);

  return (
    <div>
      <Typography variant="title" size="small">
        Styles
      </Typography>

      <Divider size={12} />
      <ConfigurationContainer>
        <GridContent>
          {/* <Select
            label="Choose Language Widget"
            value={language || 'Choose Language'}
            name="language"
            list={LANGUAGES}
            modalTitle="Languages"
            onChange={(_, value) => onChangelanguage(value)}
          /> */}

          <Select
            label="Font Face"
            value={fontFamily || 'Choose Font Face'}
            name="fontFamily"
            list={FONTS}
            modalTitle="Fonts"
            onChange={(_, value) =>
              onChangeTheme({ name: 'fontFamily', value })
            }
          />
          <div>
            <FieldName variant="body" size="small" mb={4}>
              Theme
            </FieldName>
            <ThemeContainer>
              <Checkbox
                disabled={singleTheme}
                checked={checkedTheme}
                id={'auto'}
                label={'Auto'}
                onCheckedChange={(checked) => {
                  if (checked) onChangeTheme({ name: 'mode', value: 'auto' });
                  else onChangeTheme({ name: 'mode', value: 'light' });
                  setChekedTheme(checked);
                }}
              />

              <Line />
              <ThemeSwitchAndLables>
                <Typography variant="body" size="xsmall" mr={4}>
                  Light
                </Typography>
                <ThemeSwitchContainer>
                  <Switch
                    checked={theme === 'dark'}
                    onChange={(checked) => {
                      if (!checkedTheme && !singleTheme) {
                        let theme;
                        if (checked) theme = 'dark';
                        else theme = 'light';
                        onChangeTheme({ name: 'mode', value: theme as Mode });
                      }
                    }}
                  />
                </ThemeSwitchContainer>
                <Typography variant="body" size="xsmall" ml={4}>
                  Dark
                </Typography>
              </ThemeSwitchAndLables>
            </ThemeContainer>
          </div>
          <div>
            <TextField
              size="large"
              onChange={(e) =>
                onChangeTheme({
                  name: 'borderRadius',
                  value: parseInt(e.target.value),
                })
              }
              name="borderRadius"
              value={borderRadius}
              label="Border Radius"
              type="number"
              placeholder="0"
              suffix="px"
            />
          </div>
        </GridContent>
        {/* <Divider size={24} direction="vertical" />
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
              placeholder="0"
              suffix="px"
            />
          </div>
        </GridContent>*/}
        <Divider size={20} direction="vertical" />

        <hr />
        <Divider size={24} />

        <Checkbox
          onCheckedChange={(checked) => {
            onChangeTheme({ name: 'singleTheme', value: checked });
          }}
          id="single_theme"
          label="Single Theme"
          checked={singleTheme}
        />
        <Divider size={24} />
        <ModeContainer>
          {!(singleTheme && mode === 'dark') && (
            <Button
              fullWidth
              onClick={() => {
                onChangeTheme({ name: 'mode', value: 'light' });
                setMode('light');
              }}
              type="success"
              variant={mode === 'light' ? 'contained' : 'outlined'}>
              Light
            </Button>
          )}
          {!singleTheme && <Divider size={24} direction="horizontal" />}
          {!(singleTheme && mode === 'light') && (
            <Button
              fullWidth
              onClick={() => {
                onChangeTheme({ name: 'mode', value: 'dark' });
                setMode('dark');
              }}
              type="success"
              variant={mode === 'dark' ? 'contained' : 'outlined'}>
              Dark
            </Button>
          )}
        </ModeContainer>
        <Divider size={24} />

        <GridContent>
          {customThemes.map((t, index) => (
            <Button
              type="success"
              variant="outlined"
              key={index}
              onClick={() => {
                if (t.dark && !t.light) {
                  onChangeTheme({ name: 'mode', value: 'dark' });
                  setMode('dark');
                  onChangeTheme({ name: 'singleTheme', value: true });

                  onSelectTheme({ ...t, light: {} });
                } else if (t.light && !t.dark) {
                  onChangeTheme({ name: 'mode', value: 'light' });
                  setMode('light');
                  onChangeTheme({ name: 'singleTheme', value: true });

                  onSelectTheme({ ...t, dark: {} });
                } else if (t.dark && t.light) {
                  onChangeTheme({ name: 'singleTheme', value: false });
                  onSelectTheme(t);
                }
              }}>
              <ModeContainer>
                <Circle
                  style={{
                    backgroundColor: t?.light?.success || t?.dark?.success,
                  }}
                />
                <Circle
                  style={{
                    backgroundColor:
                      t?.light?.foreground || t?.dark?.foreground,
                    zIndex: 1,
                  }}
                />
                <Circle
                  style={{
                    backgroundColor: t?.light?.primary || t?.dark?.primary,
                    position: 'absolute',
                  }}
                />
              </ModeContainer>
            </Button>
          ))}
        </GridContent>
        <Divider size={24} />

        <GridContent>
          {COLORS.map((color) => (
            <ColorPicker
              place="top"
              key={color.name}
              placeholder="Choose Color"
              color={
                colors[mode][color.name] || defaultColors[mode][color.name]
              }
              label={color.label}
              onChangeColor={(c) =>
                onChangeColors(color.name as COLORS, mode, c)
              }
            />
          ))}
        </GridContent>
        <Divider size={24} />
      </ConfigurationContainer>
    </div>
  );
}
