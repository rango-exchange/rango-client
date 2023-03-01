import {
  AngleDownIcon,
  Button,
  ColorPicker,
  Spacer,
  styled,
  TextField,
  Typography,
} from '@rangodev/ui';
import React from 'react';
import { StyleType } from '../../types/config';
import { ConfigurationContainer } from './ChainsConfig';
import { fonts, langueges } from './mock';
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

const StyledImage = styled('img', {
  width: '24px',
});

const SelectButton = styled('div', {
  flex: 1,
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
          <TextField onChange={onChangeInput} name="title" value={style.title} label="Title" />
          <TextField
            onChange={onChangeInput}
            name="width"
            value={style.width}
            label="Width"
            type="number"
            suffix="px"
          />
          <TextField
            onChange={onChangeInput}
            name="height"
            value={style.height}
            label="Height"
            type="number"
            suffix="px"
          />
        </GridContent>
        <Spacer size={20} scale="vertical" />

        <GridContent>
          <Select
            label="Choose Language Widget"
            value={style.languege}
            name="languege"
            list={langueges}
            modalTitle="Languages"
            onChange={(name, value) => onChangeStyles(name, value, false)}
          />

          <div>
            <Typography mb={4} variant="body2">
              Theme{' '}
            </Typography>
            <Button
              variant="outlined"
              suffix={<AngleDownIcon />}
              fullWidth
              align="start"
              size="large">
              Light
            </Button>
          </div>
          <TextField
            onChange={onChangeInput}
            name="borderRadius"
            value={style.borderRadius}
            label="Border Radius"
            type="number"
            suffix="px"
          />
        </GridContent>
        <Spacer size={24} scale="vertical" />

        <hr />
        <Spacer size={24} scale="vertical" />

        <GridContent>
          {COLORS.map((color) => (
            <ColorPicker
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

          <TextField
            onChange={onChangeInput}
            name="titleSize"
            value={style.titleSize}
            label="Forms Title Size"
            type="number"
            suffix="px"
          />
          <TextField
            onChange={onChangeInput}
            name="titelsWeight"
            value={style.titelsWeight}
            label="Titels Weight"
            type="number"
            suffix="px"
          />
        </GridContent>
      </ConfigurationContainer>
    </div>
  );
}
