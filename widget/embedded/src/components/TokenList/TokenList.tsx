/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes, RenderDescProps, TokenData } from './TokenList.types';

import { i18n } from '@lingui/core';
import {
  Button,
  CustomTokenWarning,
  darkTheme,
  Divider,
  ExternalLinkIcon,
  Image,
  ListItem,
  NotFound,
  PinIcon,
  Skeleton,
  Typography,
  VirtualizedList,
} from '@rango-dev/ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_TOKEN_IMAGE_SRC } from '../../constants/customTokens';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { createTintsAndShades } from '../../utils/colors';
import { getContainer } from '../../utils/common';
import { findBlockchain } from '../../utils/meta';
import { formatBalance } from '../../utils/wallets';
import { ImportCustomToken } from '../ImportCustomToken';

import { LoadingTokenList } from './LoadingTokenList';
import {
  BalanceContainer,
  Container,
  descriptionStyles,
  End,
  ImageSection,
  List,
  ListItemContainer,
  Pin,
  StyledLink,
  StyledListItemButton,
  Tag,
  TagTitle,
  Title,
  tokenAddressStyles,
  TokenBalance,
  tokenNameStyles,
  tokenTitleStyles,
  tokenWithoutNameStyles,
  usdValueStyles,
} from './TokenList.styles';

const PAGE_SIZE = 20;

const renderDesc = (props: RenderDescProps) => {
  const { address, name, url, token, customCssForTag, customCssForTagTitle } =
    props;
  const length = address.length;

  return (
    <div className={descriptionStyles()}>
      {name ? (
        <div className={tokenNameStyles()}>{name}</div>
      ) : (
        <Title className={tokenTitleStyles()}>
          <Typography variant="title" size="xmedium">
            {token.symbol}
          </Typography>
          <Divider direction="horizontal" size={4} />
          <Tag css={customCssForTag}>
            <TagTitle variant="body" size="xsmall" css={customCssForTagTitle}>
              {token.blockchain}
            </TagTitle>
          </Tag>
        </Title>
      )}

      {!!address && (
        <div
          className={`${tokenAddressStyles()} ${
            !name && tokenWithoutNameStyles()
          }`}>
          {length > 10
            ? `${address.slice(0, 5)}...${address.slice(length - 6, length)}`
            : address}{' '}
          <Divider size={4} direction="horizontal" />
          <StyledLink
            href={url}
            target="_blank"
            rel="nofollow noreferrer"
            onClick={(e) => e.stopPropagation()}>
            <ExternalLinkIcon size={12} />
          </StyledLink>
        </div>
      )}
    </div>
  );
};

export function TokenList(props: PropTypes) {
  const {
    list: tokens,
    searchedFor = '',
    onChange,
    selectedBlockchain,
    showTitle = true,
    action,
    type,
    showWarning = true,
  } = props;

  const fetchStatus = useAppStore().fetchStatus;
  const blockchains = useAppStore().blockchains();
  const { getBalanceFor, fetchingWallets: loadingWallet } = useAppStore();
  const { isTokenPinned } = useAppStore();
  const { setFromToken, setToToken } = useQuoteStore();
  const { t } = useTranslation();
  const navigateBack = useNavigateBack();

  const [customToken, setCustomToken] = useState<TokenData | null>(null);

  const updateToken = () => {
    if (type === 'source') {
      setFromToken({ token: customToken, meta: { blockchains } });
    } else {
      setToToken({ token: customToken, meta: { blockchains } });
    }
  };

  const handleImportToken = () => {
    updateToken();
    navigateBack();
  };

  const endRenderer = (token: TokenData) => {
    if (token.customToken) {
      const { customToken, ...otherProps } = token;
      const handleClick: React.MouseEventHandler<HTMLButtonElement> = (
        event
      ) => {
        event.stopPropagation();
        setCustomToken({ ...otherProps, warning: true });
      };

      return (
        // eslint-disable-next-line jsx-id-attribute-enforcement/missing-ids
        <Button
          variant="contained"
          type="primary"
          size="small"
          className="widget-token-list-item-import-btn"
          onClick={handleClick}>
          <Typography variant="body" size="xsmall" color="background">
            {t('import')}
          </Typography>
        </Button>
      );
    }
    const tokenBalance = formatBalance(getBalanceFor(token));

    if (action) {
      return action(token);
    }
    if (loadingWallet) {
      return (
        <End>
          <Skeleton variant="text" size="large" width={70} />
          <Divider size={4} />
          <Skeleton variant="text" size="medium" width={50} />
        </End>
      );
    }

    return (
      tokenBalance && (
        <BalanceContainer>
          <TokenBalance variant="title" size="small">
            {tokenBalance.amount}
          </TokenBalance>
          <div />
          {tokenBalance.usdValue && (
            <Typography
              variant="body"
              className={usdValueStyles()}
              size="xsmall">
              {`$${tokenBalance.usdValue}`}
            </Typography>
          )}
        </BalanceContainer>
      )
    );
  };
  const renderList = () => {
    return (
      <VirtualizedList
        itemContent={(index) => {
          const token = tokens[index];
          if (token === 'skeleton') {
            return (
              <ListItem
                hasDivider
                start={<Skeleton variant="circular" width={35} height={35} />}
                end={
                  <End>
                    <Skeleton variant="text" size="large" width={70} />
                    <Divider size={4} />
                    <Skeleton variant="text" size="medium" width={50} />
                  </End>
                }
                title={
                  <div>
                    <Skeleton variant="text" size="large" width={90} />
                    <Divider size={4} />
                    <Skeleton variant="text" size="medium" width={90} />
                  </div>
                }
              />
            );
          }
          const blockchain = blockchains.find(
            (blockchain) => blockchain.name === token?.blockchain
          );

          /**
           * This block is added to satisfy TypeScript without using assertions and to prevent any errors that could break the app.
           * Be cautious, as Virtuoso warns us if we return empty elements.
           * If you need to exclude any items, do so before passing them to the virtual list.
           */
          if (!blockchain || !token) {
            return null;
          }

          const address = token.address;

          const colors = createTintsAndShades(blockchain.color, 'main');
          const customCssForTag = {
            $$color: colors.main150,
            [`.${darkTheme} &`]: {
              $$color: colors.main750,
            },
            backgroundColor: '$$color',
          };

          const customCssForTagTitle = {
            $$color: colors.main750,
            [`.${darkTheme} &`]: {
              $$color: colors.main150,
            },
            color: '$$color',
          };

          const handleClick = () => {
            if (typeof token !== 'string' && !token.customToken) {
              onChange?.(token);
            }
          };

          return (
            <ListItemContainer>
              <StyledListItemButton
                tab-index={index}
                key={`${token.symbol}${address}`}
                id={`${token.symbol}${address}`}
                className="widget-token-list-item-btn"
                hasDivider
                customToken={token?.customToken}
                onClick={handleClick}
                start={
                  <ImageSection>
                    <Image
                      src={
                        token.image === ''
                          ? DEFAULT_TOKEN_IMAGE_SRC
                          : token.image
                      }
                      size={30}
                    />
                    {props.type !== 'custom-token' &&
                      token &&
                      isTokenPinned(token, props.type) && (
                        <Pin>
                          <PinIcon size={12} color="gray" />
                        </Pin>
                      )}
                  </ImageSection>
                }
                title={
                  blockchain.type === 'COSMOS' ||
                  !!token.name ||
                  (!token.name && !address) ? (
                    <Title>
                      <Typography variant="title" size="xmedium">
                        {token.symbol}
                      </Typography>
                      <Divider direction="horizontal" size={4} />
                      <Tag css={customCssForTag}>
                        <TagTitle
                          variant="body"
                          size="xsmall"
                          css={customCssForTagTitle}>
                          {token.blockchain}
                        </TagTitle>
                      </Tag>
                      {showWarning && token.warning && (
                        <>
                          <Divider direction="horizontal" size={4} />
                          <CustomTokenWarning container={getContainer()} />
                        </>
                      )}
                    </Title>
                  ) : undefined
                }
                description={
                  typeof token !== 'string' &&
                  !!blockchain.info &&
                  !!address &&
                  blockchain.type !== 'COSMOS'
                    ? renderDesc({
                        address,
                        token,
                        customCssForTag,
                        customCssForTagTitle,
                        name: token.name,
                        url: blockchain.info.addressUrl
                          .split('{wallet}')
                          .join(address),
                      })
                    : token.name || undefined
                }
                end={endRenderer(token)}
              />
            </ListItemContainer>
          );
        }}
        totalCount={tokens.length}
        key={`${selectedBlockchain}-${searchedFor}`}
      />
    );
  };

  const customTokenBlockchain = customToken
    ? findBlockchain(customToken?.blockchain, blockchains)
    : null;

  return (
    <>
      {showTitle && (
        <>
          <Typography variant="label" size="large">
            {i18n.t('Select Token')}
          </Typography>
          <Divider size={4} />
        </>
      )}

      <Container>
        <Divider size={4} />
        {fetchStatus === 'loading' && <LoadingTokenList size={PAGE_SIZE} />}
        {fetchStatus === 'success' &&
          (tokens.length ? (
            <>
              <ImportCustomToken
                token={customToken}
                address={customToken?.address ?? ''}
                blockchain={customTokenBlockchain ?? undefined}
                onImport={handleImportToken}
                onExitErrorModal={() => setCustomToken(null)}
                onExitImportModal={() => setCustomToken(null)}
              />
              <List as="ul">{renderList()}</List>
            </>
          ) : (
            !!searchedFor && (
              <NotFound
                title={i18n.t('No results found')}
                description={i18n.t('Try using different keywords')}
              />
            )
          ))}
      </Container>
    </>
  );
}
