import React, { PropsWithChildren, ReactNode } from 'react';
import { Alert, Spacer } from '../../components';
import { Button } from '../../components/Button';
import { SecondaryPage } from '../../components/SecondaryPage/SecondaryPage';
import { SelectableWalletList } from '../../components/SelectableWalletList';
import { Typography } from '../../components/Typography';
import { styled } from '../../theme';
import { SelectableWallet } from '../../types';

const MainContainer = styled('div', {
  overflowY: 'auto',
});

const Section = styled('div', {
  paddingBottom: '$32',
  marginBottom: '$32',
  borderBottom: '1px solid $neutral400',
});

const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const AlertContainer = styled('div', {
  padding: '$16 0',
});

const ConfirmButton = styled(Button, {
  marginTop: '$16',
});

const Container = styled('div', {
  paddingBottom: '$24',

  '.title': {
    paddingBottom: '$8',
    display: 'flex',
    alignItems: 'center',
  },
  '.num': {
    backgroundColor: '$neutral100',
    display: 'inline-flex',
    width: '24px',
    height: '24px',
    color: '$neutral800',
    borderRadius: '50%',
    fontSize: '$14',
    border: '1px solid $neutral400',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Alerts = styled('div', { paddingBottom: '$16' });

type Message = string | ReactNode

export interface PropTypes {
  onBack: () => void;
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  confirmDisabled?: boolean;
  loading?: boolean;
  requiredWallets: string[];
  selectableWallets: SelectableWallet[];
  onChange: (w: SelectableWallet) => void;
  isExperimentalChain?: (wallet: string) => boolean;
  handleConnectChain?: (wallet: string) => void;
  previewInputs?: ReactNode;
  previewRoutes?: ReactNode;
  confirmButtonTitle: string;
  errors?: Message[];
  warnings?: Message[];
  extraMessages?: ReactNode;
}
export function ConfirmSwap(props: PropsWithChildren<PropTypes>) {
  const {
    onBack,
    loading,
    onConfirm,
    requiredWallets,
    selectableWallets,
    onChange,
    confirmDisabled,
    isExperimentalChain,
    handleConnectChain,
    confirmButtonTitle,
    errors,
    warnings,
    extraMessages,
  } = props;

  return (
    <SecondaryPage
      textField={false}
      title="Confirm Swap"
      onBack={onBack}
      Footer={
        <Footer>
          <ConfirmButton
            fullWidth
            loading={loading}
            type="primary"
            variant="contained"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmButtonTitle}
          </ConfirmButton>
        </Footer>
      }
    >
      <MainContainer>
        <div>
          {extraMessages || null}
          <Alerts>
            {errors?.map((error, index) => (
              <React.Fragment key={index}>
                <Spacer direction="vertical" />
                <Alert type="error" key={index} 
                  {...(typeof error === 'string') ? {title: error} : {children: error} }/>
              </React.Fragment>
            ))}
            {warnings?.map((warning, index) => (
              <React.Fragment key={index}>
                <Spacer direction="vertical" />
                <Alert type="warning" key={index} 
                  {...(typeof warning === 'string') ? {title: warning} : {children: warning} }/>
              </React.Fragment>
            ))}
          </Alerts>
        </div>
        {props.previewInputs || props.previewRoutes ? (
          <Section>
            {props.previewInputs}
            {!!props.previewRoutes ? (
              <Spacer size={16} direction="vertical" />
            ) : null}
            {props.previewRoutes}
          </Section>
        ) : null}

        {requiredWallets.map((wallet, index) => {
          const list = selectableWallets.filter((w) => wallet === w.chain);
          return (
            <Container key={index}>
              <div className="title">
                <div className="num">{index + 1}</div>
                <Spacer size={8} />
                <Typography variant="body2">Your {wallet} Wallet</Typography>
              </div>
              {list.length === 0 && (
                <>
                  <AlertContainer>
                    <Alert type="error">
                      You need to connect a compatible wallet with {wallet}.
                    </Alert>
                  </AlertContainer>
                  {isExperimentalChain?.(wallet) && (
                    <Button
                      variant="contained"
                      type="primary"
                      align="grow"
                      onClick={() => handleConnectChain?.(wallet)}
                    >
                      {`Add ${wallet} chain to Cosmos wallets`}
                    </Button>
                  )}
                </>
              )}
              {list.length != 0 && (
                <SelectableWalletList list={list} onChange={onChange} />
              )}
            </Container>
          );
        })}
      </MainContainer>
    </SecondaryPage>
  );
}
