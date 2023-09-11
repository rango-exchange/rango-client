import type { PropTypes } from './SwapsGroup.types';

import { i18n } from '@lingui/core';
import { Divider, NotFound, SwapListItem, Typography } from '@rango-dev/ui';
import React from 'react';

import { limitDecimalPlaces } from '../../utils/numbers';

import { Group, NotFoundContainer, SwapList, Time } from './SwapsGroup.styles';

export function SwapsGroup(props: Omit<PropTypes, 'onBack'>) {
  const { list, onSwapClick, groupBy } = props;
  const groups = groupBy ? groupBy(list) : [{ title: 'History', swaps: list }];

  if (!list?.length) {
    return (
      <NotFoundContainer>
        <Divider size={32} />
        <NotFound
          title={i18n.t('No results found')}
          description={i18n.t('Try using different keywords')}
        />
      </NotFoundContainer>
    );
  }

  return (
    <>
      {groups
        .filter((group) => group.swaps.length > 0)
        .map((group) => (
          <React.Fragment key={group.title}>
            <Group>
              <Time>
                <Typography
                  variant="label"
                  size="medium"
                  color="neutral800"
                  className="group-title">
                  {group.title}
                </Typography>
              </Time>
              <Divider size={4} />
              <SwapList>
                {group.swaps.map((swap) => {
                  const firstStep = swap.steps[0];
                  const lastStep = swap.steps[swap.steps.length - 1];
                  return (
                    <React.Fragment key={swap.requestId}>
                      <SwapListItem
                        requestId={swap.requestId}
                        creationTime={swap.creationTime}
                        status={swap.status}
                        onClick={onSwapClick}
                        onlyShowTime={group.title === 'Today'}
                        swapTokenData={{
                          from: {
                            token: {
                              image: firstStep.fromLogo,
                              displayName: firstStep.fromSymbol,
                            },
                            blockchain: {
                              image: firstStep.fromBlockchainLogo || '',
                            },
                            amount: limitDecimalPlaces(swap.inputAmount),
                          },
                          to: {
                            token: {
                              image: lastStep.toLogo,
                              displayName: lastStep.toSymbol,
                            },
                            blockchain: {
                              image: lastStep.toBlockchainLogo || '',
                            },
                            amount: limitDecimalPlaces(
                              lastStep.outputAmount || ''
                            ),
                            estimatedAmount: limitDecimalPlaces(
                              lastStep.expectedOutputAmountHumanReadable || ''
                            ),
                          },
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </SwapList>
            </Group>
          </React.Fragment>
        ))}
    </>
  );
}
