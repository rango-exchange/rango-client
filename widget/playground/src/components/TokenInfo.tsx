import React, { useEffect, useState } from 'react';
import {
  AngleDownIcon,
  BlockchainSelector,
  Button,
  InfoCircleIcon,
  Modal,
  styled,
  TextField,
  TokenSelector,
} from '@rango-dev/ui';
import { useMetaStore } from '../store/meta';
import { useConfigStore } from '../store/config';
import { Type } from '../types';
import { tokensAreEqual } from '../helpers';

interface PropTypes {
  type: Type;
}

const ImagePlaceholder = styled('span', {
  width: '24px',
  height: '24px',
  backgroundColor: '$neutrals300',
  borderRadius: '99999px',
});
const StyledImage = styled('img', {
  width: '24px',
});
const Container = styled('div', {
  display: 'grid',
  position: 'relative',
  gap: 12,
  gridTemplateColumns: '1fr',
  '@md': {
    gridTemplateColumns: '1fr 1fr',
  },
  '@lg': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
});
const Label = styled('label', {
  display: 'inline-block',
  fontSize: '$14',
  marginBottom: '$4',
  color: '$foreground',
});

export function TokenInfo({ type }: PropTypes) {
  const to = useConfigStore.use.config().to;
  const from = useConfigStore.use.config().from;
  const amount = useConfigStore.use.config().amount;

  const onChangeAmount = useConfigStore.use.onChangeAmount();
  const onChangeBlockChain = useConfigStore.use.onChangeBlockChain();
  const onChangeToken = useConfigStore.use.onChangeToken();
  const blockchains = useMetaStore.use.meta().blockchains;
  const tokens = useMetaStore.use.meta().tokens;
  const token = tokens.find((t) => tokensAreEqual(t, type === 'Source' ? from.token : to.token));
  const chain = blockchains.find(
    (chain) => chain.name === (type === 'Source' ? from.blockchain : to.blockchain),
  );
  const supportedChains = type === 'Source' ? from.blockchains : to.blockchains;
  const supportedTokens = type == 'Source' ? from.tokens : to.tokens;

  const [modal, setModal] = useState({ open: false, isChain: false, isToken: false });
  const loadingStatus = useMetaStore.use.loadingStatus();

  const ItemSuffix = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
      <AngleDownIcon />
    </div>
  );
  useEffect(() => {
    if (!!supportedChains && !!chain && !supportedChains.includes(chain?.name)) {
      onChangeBlockChain(undefined, type);
      onChangeToken(undefined, type);
    }
    if (
      !!supportedTokens &&
      !!token &&
      !supportedTokens.filter((t) => tokensAreEqual(t, type === 'Source' ? from.token : to.token))
        .length
    ) {
      onChangeToken(undefined, type);
    }
  }, [supportedChains, supportedTokens, chain]);

  
  return (
    <Container>
      <div>
        <Label>Default Blockchains</Label>

        <Button
          variant="outlined"
          onClick={() =>
            setModal((prev) => ({
              open: !prev.open,
              isChain: true,
              isToken: false,
            }))
          }
          disabled={loadingStatus === 'failed'}
          loading={loadingStatus === 'loading'}
          prefix={
            loadingStatus === 'success' && chain ? (
              <StyledImage src={chain.logo} />
            ) : (
              <ImagePlaceholder />
            )
          }
          suffix={ItemSuffix}
          fullWidth
          align="start"
          size="large">
          {chain ? chain.displayName : 'Chain'}
        </Button>
      </div>

      <div>
        <Label>Default Token</Label>
        <Button
          variant="outlined"
          disabled={loadingStatus === 'failed' || !chain}
          loading={loadingStatus === 'loading'}
          prefix={
            loadingStatus === 'success' && token ? (
              <StyledImage src={token.image} />
            ) : (
              <ImagePlaceholder />
            )
          }
          suffix={ItemSuffix}
          fullWidth
          onClick={() =>
            setModal((prev) => ({
              open: !prev.open,
              isChain: false,
              isToken: true,
            }))
          }
          align="start"
          size="large">
          {token ? token.symbol : 'Token'}
        </Button>
      </div>

      {type !== 'Destination' ? (
        <div>
          <TextField
            onChange={(e) => onChangeAmount(parseInt(e.target.value || '0'))}
            value={amount}
            label="Default Amount"
            type="number"
            size="large"
            placeholder='0'
          />
        </div>
      ) : null}

      <Modal
        open={modal.open}
        onClose={() =>
          setModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
        content={
          modal.isChain ? (
            <BlockchainSelector
              list={
                supportedChains
                  ? blockchains.filter((chain) => supportedChains.includes(chain.name))
                  : blockchains
              }
              hasHeader={false}
              selected={chain}
              onChange={(chain) => {
                onChangeBlockChain(chain.name, type);
                onChangeToken(undefined, type);
                setModal((prev) => ({
                  ...prev,
                  open: !prev.open,
                }));
              }}
              loadingStatus={loadingStatus}
            />
          ) : (
            modal.isToken && (
              <TokenSelector
                list={(supportedTokens && supportedTokens.length
                  ? tokens.filter((token) =>
                      supportedTokens.some((supportedToken) =>
                        tokensAreEqual(supportedToken, token),
                      ),
                    )
                  : tokens
                ).filter((token) => token.blockchain === chain?.name)}
                hasHeader={false}
                // @ts-ignore
                selected={token}
                onChange={(token) => {
                  setModal((prev) => ({
                    ...prev,
                    open: !prev.open,
                  }));
                  onChangeToken(token, type);
                }}
              />
            )
          )
        }
        title={`Select ${type} blockchain`}
        containerStyle={{ width: '560px', height: '655px' }}></Modal>
    </Container>
  );
}
