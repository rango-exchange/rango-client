import { ColorPicker, Radio, Spacer, styled, TextField, Typography } from '@rangodev/ui';
import React from 'react';
import { LANGUEGES } from '../constants';
import { StyleType } from '../types';
import { ConfigurationContainer } from './ChainsConfig';
import { fonts } from './mock';
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

interface PropTypes {
  style: StyleType;
  onChange: (name: string, value: string, color: boolean) => void;
}

export function StylesConfig({ style, onChange }: PropTypes) {
  const onChangeStyles = (name, value, color) => onChange(name, value, color);
  const onChangeInput = (e) => {
    const { value, name } = e.target;
    onChangeStyles(name, value, false);
  };

  return (
    <div>
      <Typography variant="h4">Style</Typography>

      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <GridContent>
          <div>
            <TextField
              size="large"
              onChange={onChangeInput}
              name="title"
              value={style.title}
              label="Title"
            />
          </div>
          <div>
            <TextField
              size="large"
              onChange={onChangeInput}
              name="width"
              value={style.width}
              label="Width"
              type="number"
              suffix="px"
            />
          </div>
          <div>
            <TextField
              size="large"
              onChange={onChangeInput}
              name="height"
              value={style.height}
              label="Height"
              type="number"
              suffix="px"
            />
          </div>
        </GridContent>
        <Spacer size={20} scale="vertical" />

        <GridContent>
          <Select
            label="Choose Language Widget"
            value={style.languege}
            name="languege"
            list={LANGUEGES}
            modalTitle="Languages"
            onChange={(name, value) => onChangeStyles(name, value, false)}
          />

          <div>
            <TextField
              size="large"
              onChange={onChangeInput}
              name="borderRadius"
              value={style.borderRadius}
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
                defaultValue={style.theme}
                options={[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                  { value: 'auto', label: 'Auto' },
                ]}
                onChange={(value) => onChangeStyles('theme', value, false)}
                direction="horizontal"
              />
            </RadioContainer>
          </div>
        </GridContent>
        <Spacer size={24} scale="vertical" />

        <hr />
        <Spacer size={24} scale="vertical" />

        <GridContent>
          {COLORS.map((color) => (
            <ColorPicker
              place="top"
              key={color.name}
              color={style.colors[color.name]}
              label={color.label}
              onChangeColor={(c) => onChangeStyles(color.name, c.hex, true)}
            />
          ))}
        </GridContent>
        <Spacer size={24} scale="vertical" />

        <hr />
        <Spacer size={24} scale="vertical" />

        <GridContent>
          <Select
            label="Font Faminy"
            value={style.fontFaminy}
            name="fontFaminy"
            list={fonts}
            modalTitle="Fonts"
            onChange={(name, value) => onChangeStyles(name, value, false)}
          />
          <div>
            <TextField
              size="large"
              onChange={onChangeInput}
              name="titleSize"
              value={style.titleSize}
              label="Forms Title Size"
              type="number"
              suffix="px"
            />
          </div>
          <div>
            <TextField
              size="large"
              onChange={onChangeInput}
              name="titelsWeight"
              value={style.titelsWeight}
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
