import type { QuoteCostDetailsProps } from './Quote.types';
import type { NameOfFees } from '../../constants/quote';
import type BigNumber from 'bignumber.js';

import { i18n } from '@lingui/core';
import {
  ChevronDownIcon,
  CloseIcon,
  Divider,
  IconButton,
  QuoteCost,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { NAME_OF_FEES } from '../../constants/quote';
import {
  GAS_FEE_MAX_DECIMALS,
  GAS_FEE_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../constants/routing';
import { getContainer } from '../../utils/common';
import { formatTooltipNumbers, numberToString } from '../../utils/numbers';
import { getFeesGroup, getTotalFeesInUsd, getUsdFee } from '../../utils/swap';
import { WatermarkedModal } from '../common/WatermarkedModal';
import { CustomCollapsible } from '../CustomCollapsible/CustomCollapsible';
import { ExpandedIcon } from '../CustomCollapsible/CustomCollapsible.styles';

import {
  FeeSection,
  Line,
  ModalContainer,
  ModalHeader,
  trigger,
} from './QuoteCostDetails.styles';

const NonPayableFee = (props: { fee: BigNumber; label: string }) => {
  return !props.fee.isZero() ? (
    <FeeSection>
      <Typography variant="label" size="medium" color="neutral600">
        {props.label}
      </Typography>
      <Typography variant="label" size="medium">
        $
        {numberToString(
          props.fee,
          USD_VALUE_MIN_DECIMALS,
          USD_VALUE_MAX_DECIMALS
        )}
      </Typography>
    </FeeSection>
  ) : null;
};

export function QuoteCostDetails(props: QuoteCostDetailsProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openCollapse, setOpenCollapse] = useState<boolean>(false);
  const { steps, quote, fee, time, feeWarning } = props;
  const swaps = quote?.swaps ?? [];
  const container = getContainer();

  const feesGroup = getFeesGroup(swaps);

  return (
    <>
      <QuoteCost
        onClickFee={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        fee={fee}
        feeWarning={feeWarning}
        time={time}
        steps={steps}
        tooltipGas={i18n.t('View more info')}
        tooltipContainer={container}
      />

      <WatermarkedModal
        container={container}
        open={open}
        header={
          <ModalHeader>
            <Typography variant="title" size="medium">
              {i18n.t('Gas & Fee Explanation')}
            </Typography>

            <IconButton onClick={() => setOpen(false)} variant="ghost">
              <CloseIcon color="gray" size={14} />
            </IconButton>
          </ModalHeader>
        }
        onClose={() => {
          setOpen(false);
        }}>
        <ModalContainer>
          <Typography variant="title" size="small">
            {i18n.t('Details')}
          </Typography>
          <Divider size={10} />
          {Object.entries(feesGroup.payable).flatMap(
            ([payableFeesKey, feeArray]) =>
              feeArray.map((fee, index) => {
                const key = `payable-fee-${index}`;
                const usdValue = getUsdFee(fee);
                return (
                  <FeeSection key={key}>
                    <Typography
                      variant="label"
                      size="medium"
                      color="neutral600">
                      {NAME_OF_FEES[payableFeesKey as NameOfFees]}
                    </Typography>
                    <Tooltip
                      content={formatTooltipNumbers(fee.amount)}
                      container={container}>
                      <Typography variant="label" size="medium">
                        {numberToString(
                          fee.amount,
                          GAS_FEE_MIN_DECIMALS,
                          GAS_FEE_MAX_DECIMALS
                        )}{' '}
                        {fee.asset.symbol} ($
                        {numberToString(
                          usdValue,
                          USD_VALUE_MIN_DECIMALS,
                          USD_VALUE_MAX_DECIMALS
                        )}
                        )
                      </Typography>
                    </Tooltip>
                  </FeeSection>
                );
              })
          )}

          <FeeSection className="total_payable_fee">
            <Typography variant="label" size="medium">
              {i18n.t('Total Payable Fee')}
            </Typography>
            <Typography variant="label" size="medium">
              $
              {numberToString(
                fee,
                USD_VALUE_MIN_DECIMALS,
                USD_VALUE_MAX_DECIMALS
              )}
            </Typography>
          </FeeSection>
          <Line />
          {Object.keys(feesGroup.nonePayable).length && (
            <CustomCollapsible
              triggerAnchor="bottom"
              onClickTrigger={() => setOpenCollapse((prev) => !prev)}
              trigger={
                <div className={trigger()}>
                  <Typography size="small" variant="body" color="neutral700">
                    {openCollapse
                      ? i18n.t('Hide non-payable fees')
                      : i18n.t('Show non-payable fees')}
                  </Typography>
                  <Divider size={4} direction="horizontal" />
                  <ExpandedIcon orientation={openCollapse ? 'up' : 'down'}>
                    <ChevronDownIcon size={12} color="gray" />
                  </ExpandedIcon>
                </div>
              }
              open={openCollapse}>
              <Typography size="small" variant="title">
                {i18n.t('Description')}
              </Typography>
              <Divider size={4} />
              <Typography size="small" variant="body" color="neutral700">
                {i18n.t(`The following fees are considered in the transaction output and
                you won’t need to pay extra gas for them.`)}
              </Typography>
              <Divider size={10} />
              {Object.entries(feesGroup.nonePayable).map(
                ([nonPayableFeesKey, fees], index) => {
                  const totalFeeInUsd = getTotalFeesInUsd(fees);
                  const label = NAME_OF_FEES[nonPayableFeesKey as NameOfFees];
                  const key = `non-payable-fee-${index}`;
                  return (
                    <NonPayableFee
                      key={key}
                      fee={totalFeeInUsd}
                      label={label}
                    />
                  );
                }
              )}

              <Line />
            </CustomCollapsible>
          )}
        </ModalContainer>
      </WatermarkedModal>
    </>
  );
}
