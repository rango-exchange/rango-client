import {
  AngleDownIcon,
  Button,
  Checkbox,
  ColorPicker,
  Spacer,
  styled,
  TextField,
  Typography,
} from '@rangodev/ui';
import React from 'react';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';
import { TokenInfo } from './TokenInfo';
const FlexContent = styled('div', {
  display: 'flex',
  position: 'relative',
});

const StyledImage = styled('img', {
  width: '24px',
});

const SelectButton = styled('div', {
  flex: 1,
});

export function StylesConfig() {
  return (
    <div>
      <Typography variant="h4">Style</Typography>
      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <FlexContent>
          <TextField label="Title" value="Swap" />
          <Spacer size={12} />
          <TextField label="Width" type="number" suffix="px" />
          <Spacer size={12} />
          <TextField label="Height" type="number" suffix="px" />
        </FlexContent>
        <Spacer size={20} scale="vertical" />

        <FlexContent>
          <SelectButton>
            <Typography mb={4} variant="body2">
              Choose Language Widget{' '}
            </Typography>

            <Button
              variant="outlined"
              prefix={<StyledImage src="https://api.rango.exchange/blockchains/polygon.svg" />}
              suffix={<AngleDownIcon />}
              fullWidth
              align="start"
              size="large">
              English
            </Button>
          </SelectButton>

          <Spacer size={12} />
          <SelectButton>
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
          </SelectButton>

          <Spacer size={12} />
          <TextField label="Border Radius" type="number" suffix="px" />
        </FlexContent>
        <Spacer size={24} scale="vertical" />

        <hr />
        <Spacer size={24} scale="vertical" />

        <FlexContent>
        <ColorPicker color="#9C9C9C" onChangeColor={(color) => console.log(color)} />
          <Spacer size={12} />
          <ColorPicker color="#9C9C9C" onChangeColor={(color) => console.log(color)} />
          <Spacer size={12} />
          <ColorPicker color="#9C9C9C" onChangeColor={(color) => console.log(color)} />
        </FlexContent>
        <Spacer size={20} scale="vertical" />

        <FlexContent>
        <ColorPicker color="#9C9C9C" onChangeColor={(color) => console.log(color)} />
          <Spacer size={12} />
          <ColorPicker color="#9C9C9C" onChangeColor={(color) => console.log(color)} />
          <Spacer size={12} />
          <ColorPicker color="#9C9C9C" onChangeColor={(color) => console.log(color)} />
        </FlexContent>
        <Spacer size={20} scale="vertical" />

        <FlexContent>
        <ColorPicker color="#9C9C9C" onChangeColor={(color) => console.log(color)} />
          <Spacer size={12} />
          <ColorPicker color="#9C9C9C" onChangeColor={(color) => console.log(color)} />
          <Spacer size={12} />
          <ColorPicker color="#9C9C9C" onChangeColor={(color) => console.log(color)} />
        </FlexContent>
        <Spacer size={24} scale="vertical" />

        <hr />
        <Spacer size={24} scale="vertical" />

        <FlexContent>
          <SelectButton>
            <Typography mb={4} variant="body2">
              Font Faminy
            </Typography>

            <Button
              variant="outlined"
              prefix={<StyledImage src="https://api.rango.exchange/blockchains/polygon.svg" />}
              suffix={<AngleDownIcon />}
              fullWidth
              align="start"
              size="large">
              Roboto
            </Button>
          </SelectButton>

          <Spacer size={12} />
          <TextField label="Forms Title Size" type="number" suffix="px" />

          <Spacer size={12} />
          <TextField label="Titels Weight" type="number" suffix="px" />
        </FlexContent>
      </ConfigurationContainer>
    </div>
  );
}
