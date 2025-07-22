import type { QuoteCostDetailsProps } from './Quote.types';
import type { NameOfFees } from '../../constants/quote';
import type BigNumber from 'bignumber.js';

import { i18n } from '@lingui/core';
import {
  ChevronDownIcon,
  CloseIcon,
  Divider,
  IconButton,
  NumericTooltip,
  QuoteCost,
  Typography,
} from '@arlert-dev/ui';
import React, { useState } from 'react';

import { getFeeLabel } from '../../constants/quote';
import {
  GAS_FEE_MAX_DECIMALS,
  GAS_FEE_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../constants/routing';
import { getContainer, getExpanded } from '../../utils/common';
import { numberToString } from '../../utils/numbers';
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
  const {
    steps,
    quote,
    fee,
    time,
    feeWarning,
    timeWarning,
    showModalFee,
    fullExpandedMode = false,
  } = props;
  const swaps = quote?.swaps ?? [];
  const container = fullExpandedMode ? getExpanded() : getContainer();

  const feesGroup = getFeesGroup(swaps);
  const roundedFee = numberToString(
    fee,
    GAS_FEE_MIN_DECIMALS,
    GAS_FEE_MAX_DECIMALS
  );

  return (
    <>
      <QuoteCost
        onClickFee={
          showModalFee
            ? (e) => {
                e.stopPropagation();
                setOpen(!open);
              }
            : undefined
        }
        fee={roundedFee}
        feeWarning={feeWarning}
        timeWarning={timeWarning}
        time={time}
        steps={steps}
        tooltipGas={showModalFee ? i18n.t('View more info') : undefined}
        tooltipContainer={container}
      />

      <WatermarkedModal
        id="widget-quote-cost-explanation-modal"
        container={container}
        open={open}
        anchor={fullExpandedMode ? 'center' : 'bottom'}
        styles={{
          container: {
            maxWidth: fullExpandedMode ? '484px' : 'unset',
          },
        }}
        header={
          <ModalHeader
            style={{
              textAlign: fullExpandedMode ? 'left' : 'center',
            }}>
            <Typography variant="title" size="medium">
              {i18n.t('Gas & Fee Explanation')}
            </Typography>

            <IconButton
              id="widget-quote-cost-details-modal-close-icon-btn"
              onClick={() => setOpen(false)}
              variant="ghost">
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
                      {getFeeLabel(payableFeesKey as NameOfFees, i18n.t)}
                    </Typography>
                    <NumericTooltip content={fee.amount} container={container}>
                      <Typography variant="label" size="medium">
                        {numberToString(
                          fee.amount,
                          GAS_FEE_MIN_DECIMALS,
                          GAS_FEE_MAX_DECIMALS
                        )}
                        {fee.asset.symbol} ($
                        {numberToString(
                          usdValue,
                          USD_VALUE_MIN_DECIMALS,
                          USD_VALUE_MAX_DECIMALS
                        )}
                        )
                      </Typography>
                    </NumericTooltip>
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
          {!!Object.keys(feesGroup.nonePayable).length && (
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
                  const label = getFeeLabel(
                    nonPayableFeesKey as NameOfFees,
                    i18n.t
                  );
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
