import { i18n } from '@lingui/core';
import {
  Alert,
  Divider,
  InfoIcon,
  SlippageIcon,
  TextField,
  Tooltip,
  Typography,
} from '@arlert-dev/ui';
import React from 'react';

import { MAX_SLIPPAGE, SLIPPAGES } from '../../constants/swapSettings';
import { useAppStore } from '../../store/AppStore';
import { getContainer } from '../../utils/common';
import { getSlippageValidation } from '../../utils/settings';
import { isValidCurrencyFormat } from '../../utils/validation';

import {
  BaseContainer,
  Head,
  SlippageChip,
  SlippageChipsContainer,
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
    const value = input.value;
    if (!isValidCurrencyFormat(value)) {
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
              id={`widget-slippage-chip-${slippageItem.toString()}%-btn`}
              key={key}
              onClick={() => onClickSlippageChip(slippageItem)}
              selected={customSlippage === null && slippageItem === slippage}
              label={`${slippageItem.toString()}%`}
            />
          );
        })}

        <TextField
          type="number"
          min="0.01"
          max="30"
          step="0.01"
          status={
            slippageValidation?.type || (customSlippage ? 'success' : 'default')
          }
          id="widget-slippage-chip-text-input"
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
      </SlippageChipsContainer>

      {slippageValidation && (
        <>
          <Divider size={10} />
          <Alert
            id="widget-slippage-alert"
            variant="alarm"
            type={slippageValidation.type}
            title={slippageValidation.message}
          />
        </>
      )}
    </BaseContainer>
  );
}
