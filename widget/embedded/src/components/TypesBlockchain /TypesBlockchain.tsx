/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes } from './TypesBlockchain.types';

import { i18n } from '@lingui/core';
import {
  ChainsChip,
  Divider,
  Image,
  Skeleton,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { useMetaStore } from '../../store/meta';

import { generateChainsLogo } from './TypesBlockchain.helpers';
import { Container, FirstImage, ImageContent } from './TypesBlockchain.styles';
import { BlockchainType } from './TypesBlockchain.types';

export function TypesBlockchain(props: PropTypes) {
  const { setType, type } = props;
  const blockchains = useMetaStore.use.meta().blockchains;
  const loadingStatus = useMetaStore.use.loadingStatus();

  return (
    <Container>
      {loadingStatus === 'loading'
        ? Array.from(Array(5), (_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={65}
              width={index === 0 ? 45 : 65}
            />
          ))
        : Object.keys(BlockchainType).map((chainType) => (
            <ChainsChip
              selected={type === chainType}
              key={chainType}
              onClick={() => setType(chainType)}>
              {chainType !== BlockchainType.ALL && (
                <>
                  <ImageContent>
                    {generateChainsLogo(
                      blockchains,
                      chainType as Exclude<BlockchainType, 'ALL'>
                    ).map((blockchain, index) =>
                      index === 0 ? (
                        <FirstImage
                          key={`image-${blockchain.name}-${blockchain.chainId}`}
                          src={blockchain.logo}
                        />
                      ) : (
                        <Image
                          key={`image-${blockchain.name}-${blockchain.chainId}`}
                          src={blockchain.logo}
                          size={15}
                        />
                      )
                    )}
                  </ImageContent>
                  <Divider size={12} />
                </>
              )}
              <Typography size="xsmall" variant="body">
                {i18n.t(BlockchainType[chainType as BlockchainType])}
              </Typography>
            </ChainsChip>
          ))}
    </Container>
  );
}
