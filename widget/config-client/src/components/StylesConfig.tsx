import { ColorPicker, Radio, Spacer, styled, TextField, Typography } from '@rangodev/ui';
import React from 'react';
import { LANGUEGES, FONTS } from '../constants';
import { COLORS, THEME, useConfigStore } from '../store/config';
import { ConfigurationContainer } from './ChainsConfig';
import { Select } from './Select';

const COLORS = [
  {
    name: 'background',
    label: 'Background',
  },
  {
    name: 'inputBackground',
    label: 'Input Background',
  },
  {
    name: 'icons',
    label: 'Icons',
  },
  {
    name: 'primary',
    label: 'Primary Color',
  },

  {
    name: 'secondary',
    label: 'Secondary Color',
  },
  {
    name: 'text',
    label: 'Text',
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
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 12,
});

const RadioContainer = styled('div', {
  borderColor: '$neutrals600',
  color: '$neutrals500',
  border: '1px solid',
  height: '$48',
  borderRadius: '$5',
  display: 'flex',
  justifyContent: 'center',
});

export function StylesConfig() {
  const {
    title,
    width,
    height,
    languege,
    borderRadius,
    theme,
    fontFaminy,
    colors,
    titleSize,
    titelsWeight,
    onChangeStringsConfig,
    onChangeNumbersConfig,
    onChangeTheme,
    onChangeColors,
  } = useConfigStore((state) => state);

  return (
    <div>
      <Typography variant="h4">Style</Typography>

      <Spacer size={12} direction="vertical" />
      <ConfigurationContainer>
        <GridContent>
          <div>
            <TextField
              size="large"
              onChange={(e) => onChangeStringsConfig('title', e.target.value)}
              value={title}
              label="Title"
            />
          </div>
          <div>
            <TextField
              size="large"
              onChange={(e) => onChangeNumbersConfig('width', parseInt(e.target.value))}
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
              onChange={(e) => onChangeNumbersConfig('height', parseInt(e.target.value))}
              name="height"
              value={height}
              label="Height"
              type="number"
              suffix="px"
            />
          </div>
        </GridContent>
        <Spacer size={20} direction="vertical" />

        <GridContent>
          <Select
            label="Choose Language Widget"
            value={languege}
            name="languege"
            list={LANGUEGES}
            modalTitle="Languages"
            onChange={(_, value) => onChangeStringsConfig('languege', value)}
          />

          <div>
            <TextField
              size="large"
              onChange={(e) => onChangeNumbersConfig('borderRadius', parseInt(e.target.value))}
              name="borderRadius"
              value={borderRadius}
              label="Border Radius"
              type="number"
              suffix="px"
            />
          </div>

          <div>
            <Typography variant="body2" mb={4}>
              Theme
            </Typography>
            <RadioContainer>
              <Radio
                defaultValue={theme}
                options={[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                  { value: 'auto', label: 'Auto' },
                ]}
                onChange={(value) => onChangeTheme(value as THEME)}
                direction="horizontal"
              />
            </RadioContainer>
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

        <hr />
        <Spacer size={24} direction="vertical" />

        <GridContent>
          <Select
            label="Font Faminy"
            value={fontFaminy}
            name="fontFaminy"
            list={FONTS}
            modalTitle="Fonts"
            onChange={(_, value) => onChangeStringsConfig('fontFaminy', value)}
          />
          <div>
            <TextField
              size="large"
              onChange={(e) => onChangeNumbersConfig('titleSize', parseInt(e.target.value))}
              name="titleSize"
              value={titleSize}
              label="Forms Title Size"
              type="number"
              suffix="px"
            />
          </div>
          <div>
            <TextField
              size="large"
              onChange={(e) => onChangeNumbersConfig('titelsWeight', parseInt(e.target.value))}
              name="titelsWeight"
              value={titelsWeight}
              label="Titels Weight"
              type="number"
              suffix="px"
            />
          </div>
        </GridContent>
      </ConfigurationContainer>
    </div>
  );
}
