import React, { PropsWithChildren, ReactNode } from 'react';
import { Alert, Checkbox, Divider, TextField } from '../../components';
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

type Message = string | ReactNode;

export interface PropTypes {
  onBack: () => void;
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  confirmDisabled?: boolean;
  loading?: boolean;
  requiredWallets: string[];
  selectableWallets: SelectableWallet[];
  onChange: (w: SelectableWallet | { chain: string; address: string }) => void;
  isExperimentalChain?: (wallet: string) => boolean;
  handleConnectChain?: (wallet: string) => void;
  previewInputs?: ReactNode;
  previewRoutes?: ReactNode;
  confirmButtonTitle: string;
  errors?: Message[];
  warnings?: Message[];
  extraMessages?: ReactNode;
  customDestination?: string;
  checkedDestination: boolean;
  setDestinationChain: (chain: string) => void;
  setCustomDestination: (customDestination: string) => void;
  customDestinationEnabled?: boolean;
  isValidCustomDestination: (blockchain: string, address: string) => boolean;
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
    customDestination,
    setCustomDestination,
    checkedDestination,
    setDestinationChain,
    customDestinationEnabled = true,
    isValidCustomDestination,
  } = props;
console.log(props);

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
            disabled={
              confirmDisabled ||
              (!!customDestination &&
                !isValidCustomDestination(requiredWallets[requiredWallets.length - 1], customDestination))
            }>
            {confirmButtonTitle}
          </ConfirmButton>
        </Footer>
      }>
      <MainContainer>
        <div>
          {extraMessages || null}
          <Alerts>
            {errors?.map((error, index) => (
              <React.Fragment key={index}>
                <Divider />
                <Alert
                  type="error"
                  key={index}
                  {...(typeof error === 'string'
                    ? { title: error }
                    : { children: error })}
                />
              </React.Fragment>
            ))}
            {warnings?.map((warning, index) => (
              <React.Fragment key={index}>
                <Divider />
                <Alert
                  type="warning"
                  key={index}
                  {...(typeof warning === 'string'
                    ? { title: warning }
                    : { children: warning })}
                />
              </React.Fragment>
            ))}
          </Alerts>
        </div>
        {props.previewInputs || props.previewRoutes ? (
          <Section>
            {props.previewInputs}
            {!!props.previewRoutes ? <Divider size={16} /> : null}
            {props.previewRoutes}
          </Section>
        ) : null}

        {requiredWallets.map((wallet, index) => {
          const list = selectableWallets.filter((w) => wallet === w.chain);
          return (
            <Container key={index}>
              <div className="title">
                <div className="num">{index + 1}</div>
                <Divider size={8} direction="horizontal" />
                <Typography variant="body2">Your {wallet} Wallet</Typography>
              </div>
              {list.length === 0 &&
                (index < requiredWallets.length - 1 ||
                  (index === requiredWallets.length - 1 && !checkedDestination)) && (
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
                        onClick={() => handleConnectChain?.(wallet)}>
                        {`Add ${wallet} chain to Cosmos wallets`}
                      </Button>
                    )}
                  </>
                )}
              {list.length != 0 && (
                <SelectableWalletList
                  list={list}
                  onChange={(w) => {
                    onChange(w);
                    setDestinationChain('');
                    setCustomDestination('');
                  }}
                />
              )}
              {index === requiredWallets.length - 1 && customDestinationEnabled && (
                <>
                  <Divider />
                  <Checkbox
                    label={`Choose a custom ${wallet} address`}
                    checked={checkedDestination}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        setDestinationChain('');
                        setCustomDestination('');
                        list.length && onChange(list[0]);
                      } else {
                        setDestinationChain(wallet);
                      }
                    }}
                    id={'custom_destination'}
                  />
                  <Divider />

                  {checkedDestination && (
                    <>
                      <TextField
                        placeholder="Your destination address"
                        value={customDestination}
                        onChange={(e) => {
                          setCustomDestination(e.target.value);
                          onChange({
                            chain: wallet,
                            address: e.target.value,
                          });
                        }}
                      />
                      {!!customDestination && !isValidCustomDestination(wallet, customDestination) && (
                        <AlertContainer>
                          <Alert type="error">Not a valid {wallet} address.</Alert>
                        </AlertContainer>
                      )}
                    </>
                  )}
                </>
              )}
            </Container>
          );
        })}
      </MainContainer>
    </SecondaryPage>
  );
}
