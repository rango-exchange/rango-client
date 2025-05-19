import { i18n } from '@lingui/core';
import {
  Alert,
  Divider,
  InfoIcon,
  SlippageIcon,
  TextField,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { MAX_SLIPPAGE, SLIPPAGES } from '../../constants/swapSettings';
import { useAppStore } from '../../store/AppStore';
import { getContainer } from '../../utils/common';
import { getSlippageValidation } from '../../utils/settings';

import {
  BaseContainer,
  Head,
  SlippageChip,
  SlippageChipsContainer,
  SlippageTextFieldContainer,
} from './Slippage.styles';
import { SlippageTooltipContent } from './SlippageTooltipContent';

export function Slippage() {
  const { slippage, setSlippage, customSlippage, setCustomSlippage } =
    useAppStore();

  const slippageValidation =
    customSlippage !== null ? getSlippageValidation(customSlippage) : null;

  const onSlippageValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return setCustomSlippage(null);
    }
    let slippage = parsedValue;
    if (parsedValue > MAX_SLIPPAGE) {
      slippage = MAX_SLIPPAGE;
    }
    setCustomSlippage(slippage);
  };

  const onClickSlippageChip = (slippageItem: number) => {
    if (customSlippage !== null) {
      setCustomSlippage(null);
    }
    setSlippage(slippageItem);
  };

  const onInput = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const value = input.value;
    if (!regex.test(value)) {
      input.value = value.slice(0, -1);
    }
  };

  return (
    <BaseContainer>
      <Head>
        <SlippageIcon size={16} color="gray" />
        <Divider direction="horizontal" size={4} />
        <Typography variant="title" size="xmedium">
          {i18n.t('Slippage tolerance per swap')}
        </Typography>
        <Divider direction="horizontal" size={4} />
        <Tooltip
          container={getContainer()}
          side="top"
          sideOffset={4}
          content={<SlippageTooltipContent />}>
          <InfoIcon color="gray" />
        </Tooltip>
      </Head>
      <SlippageChipsContainer>
        {SLIPPAGES.map((slippageItem, index) => {
          const key = `slippage-${index}`;
          return (
            <SlippageChip
              key={key}
              onClick={() => onClickSlippageChip(slippageItem)}
              selected={customSlippage === null && slippageItem === slippage}
              label={`${slippageItem.toString()}%`}
            />
          );
        })}
        <SlippageTextFieldContainer
          status={
            slippageValidation?.type || (customSlippage ? 'safe' : 'empty')
          }>
          <TextField
            type="number"
            min="0.01"
            max="30"
            step="0.01"
            onInput={onInput}
            fullWidth
            variant="contained"
            value={customSlippage === null ? '' : customSlippage}
            color="dark"
            onChange={onSlippageValueChange}
            suffix={
              customSlippage && (
                <Typography variant="body" size="small">
                  %
                </Typography>
              )
            }
            placeholder={i18n.t('Custom')}
          />
        </SlippageTextFieldContainer>
      </SlippageChipsContainer>

      {slippageValidation && (
        <>
          <Divider size={10} />
          <Alert
            variant="alarm"
            type={slippageValidation.type}
            title={slippageValidation.message}
          />
        </>
      )}
    </BaseContainer>
  );
}
