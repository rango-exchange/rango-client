import React, { useEffect, useRef, useState } from 'react';
import { useWallets } from '@rango-dev/wallets-core';
import { Networks, WalletType, isEvmAddress } from '@rango-dev/wallets-shared';
import './styles.css';
import {
  BestRoute,
  Button,
  Divider,
  Modal,
  Typography,
  styled,
} from '@rango-dev/ui';

import { SwapComponent } from '../Swap';
import {
  Asset,
  BestRouteRequest,
  BestRouteResponse,
  RangoClient,
  Token,
  TransactionStatus,
  TransactionType,
  isCosmosBlockchain,
  isEvmBlockchain,
  isSolanaBlockchain,
  isStarknetBlockchain,
  isTronBlockchain,
} from 'rango-sdk';

import { swaps } from '../../constants';
type Props = {
  type: WalletType;
  open: boolean;
  onClose: () => void;
  tokens: Token[];
};

const SwitchButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  top: '11px',
});
const INTERVAL_FOR_CHECK = 5_000;

function SignModal({ type, open, onClose, tokens }: Props) {
  const { getWalletInfo, state, getSigners, canSwitchNetworkTo, connect } =
    useWallets();
  const client = new RangoClient(process.env.REACT_APP_API_KEY as string);
  const { accounts, network } = state(type);
  const { supportedChains: blockchains } = getWalletInfo(type);
  const blockchain = blockchains.find((chain) => chain.name === network);
  const swap =
    !!blockchain &&
    (isEvmBlockchain(blockchain)
      ? swaps.EVM
      : isCosmosBlockchain(blockchain)
      ? swaps.COSMOS
      : isSolanaBlockchain(blockchain)
      ? swaps.SOLANA
      : isStarknetBlockchain(blockchain)
      ? swaps.STARKNET
      : isTronBlockchain(blockchain) && swaps.TRON);

  const [addresses, setAddresses] = useState<string[]>([]);
  const [bestRoute, setBestRoute] = useState<BestRouteResponse | null>();
  const [loadingSwap, setLoadingSwap] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hash, setHash] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const signers = getSigners(type);
  const timer = useRef({});

  const resetStates = () => {
    setBestRoute(null);
    setLoadingSwap(false);
    setStep(1);
    setHash('');
  };

  const checkStatus = async () => {
    try {
      const { status } = await client.checkStatus({
        requestId: bestRoute?.requestId || '',
        step,
        txId: hash,
      });
      if (status === TransactionStatus.SUCCESS && !!bestRoute) {
        clearInterval(timer.current as any);
        if (step + 1 > (bestRoute.result?.swaps.length || 1)) {
          resetStates();
        } else if (step <= (bestRoute.result?.swaps.length || 1)) {
          setHash('');
          createTx(bestRoute, step + 1);
          setStep((prev) => prev + 1);
        }
        alert('Well Done, The swap was successful!');
      } else if (status === TransactionStatus.FAILED) {
        setError(`Error requesting check status: faild status`);
        setLoadingSwap(false);
        clearInterval(timer.current as any);
      }
    } catch (error) {
      console.log(`Error requesting check status: ${error}`);
    }
  };

  const canSwitchNetwork = (network) =>
    network !== Networks.Unknown && canSwitchNetworkTo(type, network);
  const handleChangeNetwork = async (network) => {
    if (canSwitchNetwork(network)) {
      try {
        await connect(type, network);
      } catch (err) {
        setError('Error: ' + (err.message || 'Failed to connect wallet'));
      }
    }
  };
  const onswap = async () => {
    setError('');
    setBestRoute(null);
    if (!addresses) {
      setError('Please connect your wallet and try again.');
      return;
    }

    if (!swap) {
      setError(`There is no any swap`);
      return;
    }

    setLoadingSwap(true);

    const fromToken = swap.from.split('.');
    const toToken = swap.to.split('.');

    const from: Asset = {
      blockchain: fromToken[0],
      symbol: fromToken[1],
      address: fromToken[2],
    };
    const to: Asset = {
      blockchain: toToken[0],
      symbol: toToken[1],
      address: toToken[2],
    };
    const amount: string = swap.amount;
    let selectedWallets = {};
    addresses.map((account) => {
      const [chain, address] = account.split(':');
      selectedWallets = { ...selectedWallets, [chain]: address };
    });

    const request: BestRouteRequest = {
      amount,
      from,
      to,
      swappersGroupsExclude: true,
      connectedWallets: [],
      selectedWallets,
      checkPrerequisites: true,
    };

    try {
      const bestRoute = await client.getBestRoute(request);
      setBestRoute(bestRoute);

      if (!bestRoute || !bestRoute?.result?.resultType) {
        setError(
          `Invalid bestRoute response: ${bestRoute?.result?.resultType}, please try again.`
        );
        setLoadingSwap(false);
      } else {
        createTx(bestRoute, step);
      }
    } catch (error) {
      setError(`Error requesting bestRoute: ${error}`);
      setLoadingSwap(false);
    }
  };
  const createTx = async (bestRoute: BestRouteResponse, step: number) => {
    if (!!bestRoute && !!accounts) {
      if (
        network !== bestRoute.from.blockchain &&
        canSwitchNetwork(bestRoute.from.blockchain)
      ) {
        await handleChangeNetwork(bestRoute.from.blockchain);
      } else {
        try {
          const { transaction } = await client.createTransaction({
            requestId: bestRoute?.requestId,
            step,
            userSettings: {
              slippage: '1.0',
              infiniteApprove: false,
            },
            validations: {
              balance: false,
              fee: false,
            },
          });
          if (!transaction) {
            setError(`Error requesting create transaction: try again`);
            setLoadingSwap(false);
            return;
          }

          let address = '';
          let chainId: string | null = null;
          for (const account of addresses) {
            const [chain, walletAddress] = account.split(':');
            if (chain === bestRoute.from.blockchain) address = walletAddress;
          }

          blockchains.map((blockchain) => {
            if (blockchain.name === bestRoute.from.blockchain)
              chainId = blockchain.chainId;
          });

          const { hash } = await signers
            .getSigner(transaction?.type as TransactionType)
            .signAndSendTx(transaction, address, chainId);

          setHash(hash);
        } catch (e) {
          setError(`Error requesting create transaction: ${e.message}`);
          setLoadingSwap(false);
        }
      }
    } else {
      setError('Somting wrong');
      setLoadingSwap(false);
    }
  };
  const cancel = async () => {
    try {
      await client.reportFailure({
        eventType: 'USER_CANCEL',
        reason: 'Swap canceled by user.',
        requestId: bestRoute?.requestId || '',
        step,
        tags: { wallet: type },
      });
      resetStates();
      clearInterval(timer.current as any);
    } catch (e) {
      setError(`Error requesting cancel: ${e}`);
    }
  };

  useEffect(() => {
    let allAdresses: string[] = [];
    accounts?.map((account) => {
      const [_, address] = account.split(':');
      if (!!isEvmAddress(address)) {
        allAdresses = [
          ...allAdresses,
          ...blockchains.map((chain) => `${chain.name}:${address}`),
        ];
      } else allAdresses = [...allAdresses, account];
    });
    setAddresses(allAdresses);
  }, []);

  useEffect(() => {
    if (!!hash)
      timer.current = setInterval(() => checkStatus(), INTERVAL_FOR_CHECK);
  }, [hash]);

  useEffect(() => {
    if (loadingSwap && bestRoute) createTx(bestRoute, step);
  }, [network]);

  return (
    <Modal
      title="Swap"
      open={open}
      onClose={() => {
        if (!loadingSwap) {
          onClose();
          resetStates();
        }
      }}
      content={
        <div>
          <SwapComponent
            tokens={tokens}
            from={
              (!!swap && {
                blockchain: blockchains.find(
                  (chain) => swap.from.split('.')[0] === chain.name
                ),
                token: swap.from.split('.')[1],
                addresse: swap.from.split('.')[2],
                amount: swap.amount,
              }) ||
              undefined
            }
            to={
              (!!swap && {
                blockchain: blockchains.find(
                  (chain) => swap.to.split('.')[0] === chain.name
                ),
                token: swap.to.split('.')[1],
                addresse: swap.to.split('.')[2],
                amount: swap.amount,
              }) ||
              undefined
            }
          />

          <Divider />
          {bestRoute && (
            <BestRoute
              data={bestRoute}
              feeWarning={false}
              totalFee="-"
              totalTime="-"
            />
          )}
          <div className="swap-details-container">
            {!!error && (
              <Typography variant="body2" color="error" mb={12}>
                {error}
              </Typography>
            )}
            <br />
            <SwitchButtonContainer>
              <Button
                fullWidth
                onClick={onswap}
                loading={loadingSwap}
                type="primary">
                Swap
              </Button>
              <Divider direction="horizontal" />
              <Button
                onClick={cancel}
                disabled={!loadingSwap}
                variant="outlined"
                type="error">
                cancel
              </Button>
            </SwitchButtonContainer>
            <Divider />
          </div>
        </div>
      }
    />
  );
}

export default SignModal;
