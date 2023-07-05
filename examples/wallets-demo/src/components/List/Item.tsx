import React, { useState } from 'react';
import { readAccountAddress, useWallets } from '@rango-dev/wallets-core';
import {
  Network,
  WalletType,
  detectInstallLink,
  WalletInfo,
  Networks,
} from '@rango-dev/wallets-shared';
import './styles.css';
import {
  Button,
  HorizontalSwapIcon,
  InfoCircleIcon,
  SignatureIcon,
  Divider,
  Spinner,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import {
  evmBasedChainsSelector,
  prepareAccounts,
  walletAndSupportedChainsNames,
} from '../../helper';
import { TransactionType } from 'rango-sdk';

function Item({ type, info }: { type: WalletType; info: WalletInfo }) {
  const { connect, state, disconnect, canSwitchNetworkTo, getSigners } =
    useWallets();
  const walletState = state(type);
  const [network, setNetwork] = useState<Network>(Networks.Unknown);
  const [error, setError] = useState<string>('');
  const evmBasedChains = evmBasedChainsSelector(info.supportedChains);
  const handleConnectWallet = async () => {
    if (walletState.connecting) return;
    try {
      if (!walletState.connected) {
        if (walletState.installed) {
          const result = await connect(type);
          setError('');
          setNetwork(result.network || Networks.Unknown);
        } else {
          window.open(detectInstallLink(info.installLink), '_blank');
        }
      } else {
        disconnect(type);
      }
    } catch (err) {
      setError('Error: ' + (err.message || 'Failed to connect wallet'));
    }
  };
  const canSwitchNetwork =
    network !== Networks.Unknown && canSwitchNetworkTo(type, network);
  const handleChangeNetwork = async () => {
    if (canSwitchNetwork) {
      try {
        const result = await connect(type, network);
        setError('');
        setNetwork(result.network || Networks.Unknown);
      } catch (err) {
        setError('Error: ' + (err.message || 'Failed to connect wallet'));
      }
    }
  };
  const handleSigner = () => {
    if (!walletState.accounts || !walletState.accounts.length) {
      alert(
        "You don't currently have an account or you haven't connected to wallet correctly!"
      );
    } else {
      const supportedChainsNames = walletAndSupportedChainsNames(
        info.supportedChains
      );
      console.log({ walletState });
      const activeAccount = prepareAccounts(
        walletState.accounts,
        walletState.network,
        evmBasedChains,
        supportedChainsNames
      ).find((a) => a.accounts.find((b) => b.isConnected));

      console.log({ activeAccount });

      const signers = getSigners(type);
      const address =
        (walletState.accounts?.length > 1 &&
          readAccountAddress(
            walletState.accounts.find((account) =>
              account?.toLowerCase()?.includes(network?.toLowerCase())
            )!
          ).address) ||
        activeAccount?.accounts[0].address;

      const currentChain = info.supportedChains.find(
        (chain) => chain.name === network
      );
      const txType = currentChain?.type || TransactionType.EVM;
      const chainId = currentChain?.chainId || null;
      console.log({ txType, chainId, address });
      const result = signers
        .getSigner(txType)
        .signMessage(
          'Hello World',
          address || 'meow',
          chainId && String(parseInt(chainId))
        );
      result
        .then((signature) => {
          alert(signature);
        })
        .catch((ex) => {
          alert(
            'Error' + `(${info.name}): ` + (ex.message || 'Failed to sign')
          );
          console.log({ ex });
        });
    }
  };
  const handleSignSigner = () => {
    if (!walletState.accounts || !walletState.accounts.length) {
      alert(
        "You don't currently have an account or you haven't connected to wallet correctly!"
      );
    } else {
      const supportedChainsNames = walletAndSupportedChainsNames(
        info.supportedChains
      );
      console.log({ walletState });
      const activeAccount = prepareAccounts(
        walletState.accounts,
        walletState.network,
        evmBasedChains,
        supportedChainsNames
      ).find((a) => a.accounts.find((b) => b.isConnected));

      console.log({ activeAccount });

      const signers = getSigners(type);
      const address =
        (walletState.accounts?.length > 1 &&
          readAccountAddress(
            walletState.accounts.find((account) =>
              account?.toLowerCase()?.includes(network?.toLowerCase())
            )!
          ).address) ||
        activeAccount?.accounts[0].address;

      const currentChain = info.supportedChains.find(
        (chain) => chain.name === network
      );
      const txType = currentChain?.type || TransactionType.COSMOS;
      const chainId = currentChain?.chainId || null;
      // Ethereum
      //
      // const tx = {
      //   type: 'EVM',
      //   blockChain: 'ETH',
      //   isApprovalTx: false,
      //   from: '0x5423e28219d6d568dcf62a8134d623e6f4a1c2df',
      //   to: '0x69460570c93f9DE5E2edbC3052bf10125f0Ca22d',
      //   spender: null,
      //   data: '0xb17d0e6e00000000000000000000000000000000a521c8deda5b42dba56a3d26f43fc0030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec700000000000000000000000000000000000000000000000000038d675c4f9800000000000000000000000000000000000000000000000000000000174876e80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001d7775000000000000000000000000000000000000000000000000000000000000006a00000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005423e28219d6d568dcf62a8134d623e6f4a1c2df00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000216b4b4ba9f3e719726886d34a177484278bfcae000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000038d675c4f980000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000e40b86a4c1000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000038d675c4f980000000000000000000000000000000000000000000000000000000000001d7776000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000004de4e2e5aca8e483a4c057892ee1f03bebc9bfa1f9c200000000000000000000000000000000000000000000000000000000',
      //   value: '0x38d7ea4c68000',
      //   gasLimit: '0x4e771',
      //   gasPrice: null,
      //   maxPriorityFeePerGas: '996892204',
      //   maxFeePerGas: '17900932338',
      //   nonce: null,
      // };

      // sign amino
      // const tx = {
      //   type: 'COSMOS',
      //   fromWalletAddress: 'cosmos1unf2rcytjxfpz8x8ar63h4qeftadptg5r5qswd',
      //   blockChain: 'COSMOS',
      //   data: {
      //     chainId: 'cosmoshub-4',
      //     account_number: 427198,
      //     sequence: '133',
      //     msgs: [
      //       {
      //         __type: 'CosmosIBCTransferMessage',
      //         type: 'cosmos-sdk/MsgTransfer',
      //         '@type': '/ibc.applications.transfer.v1.MsgTransfer',
      //         value: {
      //           source_port: 'transfer',
      //           source_channel: 'channel-141',
      //           token: {
      //             denom: 'uatom',
      //             amount: '200000',
      //           },
      //           sender: 'cosmos1unf2rcytjxfpz8x8ar63h4qeftadptg5r5qswd',
      //           receiver: 'osmo1unf2rcytjxfpz8x8ar63h4qeftadptg5t0nqcl',
      //           timeout_height: {
      //             revision_number: '1',
      //             revision_height: '10368101',
      //           },
      //           timeout_timestamp: '1688394728582000000',
      //         },
      //       },
      //     ],
      //     protoMsgs: [
      //       {
      //         type_url: '/ibc.applications.transfer.v1.MsgTransfer',
      //         value: [
      //           10, 8, 116, 114, 97, 110, 115, 102, 101, 114, 18, 11, 99, 104,
      //           97, 110, 110, 101, 108, 45, 49, 52, 49, 26, 15, 10, 5, 117, 97,
      //           116, 111, 109, 18, 6, 50, 48, 48, 48, 48, 48, 34, 45, 99, 111,
      //           115, 109, 111, 115, 49, 117, 110, 102, 50, 114, 99, 121, 116,
      //           106, 120, 102, 112, 122, 56, 120, 56, 97, 114, 54, 51, 104, 52,
      //           113, 101, 102, 116, 97, 100, 112, 116, 103, 53, 114, 53, 113,
      //           115, 119, 100, 42, 43, 111, 115, 109, 111, 49, 117, 110, 102,
      //           50, 114, 99, 121, 116, 106, 120, 102, 112, 122, 56, 120, 56, 97,
      //           114, 54, 51, 104, 52, 113, 101, 102, 116, 97, 100, 112, 116,
      //           103, 53, 116, 48, 110, 113, 99, 108, 50, 7, 8, 1, 16, -27, -24,
      //           -8, 4, 56, -128, -37, -106, -82, -10, -63, -104, -73, 23,
      //         ],
      //       },
      //     ],
      //     memo: '',
      //     source: null,
      //     fee: {
      //       gas: '300000',
      //       amount: [
      //         {
      //           denom: 'uatom',
      //           amount: '7500',
      //         },
      //       ],
      //     },
      //     signType: 'AMINO',
      //     rpcUrl: null,
      //   },
      //   rawTransfer: null,
      // };

      // sign direct
      const tx = {
        type: 'COSMOS',
        fromWalletAddress: 'juno1unf2rcytjxfpz8x8ar63h4qeftadptg54xrtf3',
        blockChain: 'JUNO',
        data: {
          chainId: 'juno-1',
          account_number: 125507,
          sequence: '295',
          msgs: [
            {
              __type: 'wasm/MsgExecuteContract',
              typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
              value: {
                sender: 'juno1unf2rcytjxfpz8x8ar63h4qeftadptg54xrtf3',
                contract:
                  'juno1pctfpv9k03v0ff538pz8kkw5ujlptntzkwjg6c0lrtqv87s9k28qdtl50w',
                msg: 'eyJleGVjdXRlX3N3YXBfb3BlcmF0aW9ucyI6eyJvcGVyYXRpb25zIjpbeyJ3eW5kZXhfc3dhcCI6eyJhc2tfYXNzZXRfaW5mbyI6eyJuYXRpdmUiOiJpYmMvQzRDRkY0NkZENkRFMzVDQTRDRjRDRTAzMUU2NDNDOEZEQzlCQTRCOTlBRTU5OEU5QjBFRDk4RkUzQTIzMTlGOSJ9LCJvZmZlcl9hc3NldF9pbmZvIjp7Im5hdGl2ZSI6InVqdW5vIn19fV0sIm1heF9zcHJlYWQiOiIwLjAxIn19',
                funds: [
                  {
                    denom: 'ujuno',
                    amount: '100000',
                  },
                ],
              },
            },
          ],
          protoMsgs: [],
          memo: '',
          source: null,
          fee: {
            gas: '1000000',
            amount: [
              {
                denom: 'ujuno',
                amount: '2500',
              },
            ],
          },
          signType: 'DIRECT',
          rpcUrl: 'https://rpc-juno.itastakers.com:443/',
        },
        rawTransfer: null,
      };
      console.log({ txType, chainId, address });
      const result = signers
        .getSigner(txType)
        .signAndSendTx(tx, address || 'meow', chainId);
      result
        .then((signature) => {
          alert(signature);
        })
        .catch((ex) => {
          alert(
            'Error' + `(${info.name}): ` + (ex.message || 'Failed to sign')
          );
          console.log({ ex });
        });
    }
  };
  return (
    <div className="wallet_box">
      <div>
        <div className="header">
          {walletState.connected ? (
            <div className="title">
              <div className="image_div">
                <img src={info.img} alt={info.name} width={35} />
              </div>
              <h3>{info.name}</h3>
            </div>
          ) : (
            <div />
          )}
          <div className="info">
            {walletState.connected && !canSwitchNetwork && (
              <>
                <Tooltip
                  content="Only default network is supported for this wallet."
                  color="gray"
                >
                  <InfoCircleIcon size={24} color="success" />
                </Tooltip>
                <Divider size={12} direction="horizontal" />
              </>
            )}
            <div
              className={`wallet_status ${
                walletState.connected ? 'connected' : 'disconnected'
              }`}
            />
          </div>
        </div>

        {walletState.connected ? (
          <>
            <h4 className="mt-8">Accounts: </h4>
            <div className="account_box">
              {walletState?.accounts?.map((account) => (
                <div className="account">{account}</div>
              ))}
            </div>
            <div className="mt-10">
              <h4>Chain: </h4>
              <div className="font-14">{walletState?.network}</div>
            </div>
          </>
        ) : (
          <div className="body">
            <img src={info.img} alt={info.name} width={100} />
            <h2 className="my-12">{info.name}</h2>
            <Typography variant="body2">
              {!walletState.installed
                ? 'The wallet is not installed'
                : 'The wallet is disconnected'}
            </Typography>
          </div>
        )}

        {error && (
          <p className="error-msg">
            <InfoCircleIcon color="error" size={16} />
            {error}
          </p>
        )}
      </div>

      <div>
        <select
          name="Network"
          id="Network"
          onChange={(e) => setNetwork(e.target.value)}
          disabled={!walletState.connected}
        >
          <option value="-1" selected>
            Default Chain
          </option>
          {info.supportedChains.map((network) => (
            <option key={network.name} value={network.name}>
              {network.displayName}
            </option>
          ))}
        </select>
        <div className="flex mb-5">
          <Button
            fullWidth
            suffix={walletState.connecting && <Spinner />}
            type="primary"
            onClick={handleConnectWallet}
          >
            {!walletState.installed
              ? 'Install'
              : walletState.connected
              ? 'Disconnect'
              : 'Connect'}
          </Button>
          <Divider size={12} direction="horizontal" />
          <Button
            fullWidth
            disabled={!walletState.connected || !canSwitchNetwork}
            type="primary"
            onClick={handleChangeNetwork}
          >
            Change Network
          </Button>
        </div>
        <div className="flex">
          <Button
            fullWidth
            disabled={!walletState.connected}
            type="primary"
            suffix={<SignatureIcon size={24} color="white" />}
            onClick={handleSigner}
          >
            Sign
          </Button>
          <Divider size={12} direction="horizontal" />
          <Button
            fullWidth
            disabled={!walletState.connected}
            suffix={<HorizontalSwapIcon size={24} color="white" />}
            type="primary"
            onClick={handleSignSigner}
          >
            Swap
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Item;
