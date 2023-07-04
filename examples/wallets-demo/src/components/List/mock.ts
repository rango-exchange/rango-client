export const Tx_Cosmos_Amino = {
  type: 'COSMOS',
  fromWalletAddress: 'cosmos1unf2rcytjxfpz8x8ar63h4qeftadptg5r5qswd',
  blockChain: 'COSMOS',
  data: {
    chainId: 'cosmoshub-4',
    account_number: 427198,
    sequence: '133',
    msgs: [
      {
        __type: 'CosmosIBCTransferMessage',
        type: 'cosmos-sdk/MsgTransfer',
        '@type': '/ibc.applications.transfer.v1.MsgTransfer',
        value: {
          source_port: 'transfer',
          source_channel: 'channel-141',
          token: {
            denom: 'uatom',
            amount: '200000',
          },
          sender: 'cosmos1unf2rcytjxfpz8x8ar63h4qeftadptg5r5qswd',
          receiver: 'osmo1unf2rcytjxfpz8x8ar63h4qeftadptg5t0nqcl',
          timeout_height: {
            revision_number: '1',
            revision_height: '10368101',
          },
          timeout_timestamp: '1688394728582000000',
        },
      },
    ],
    protoMsgs: [
      {
        type_url: '/ibc.applications.transfer.v1.MsgTransfer',
        value: [
          10, 8, 116, 114, 97, 110, 115, 102, 101, 114, 18, 11, 99, 104, 97,
          110, 110, 101, 108, 45, 49, 52, 49, 26, 15, 10, 5, 117, 97, 116, 111,
          109, 18, 6, 50, 48, 48, 48, 48, 48, 34, 45, 99, 111, 115, 109, 111,
          115, 49, 117, 110, 102, 50, 114, 99, 121, 116, 106, 120, 102, 112,
          122, 56, 120, 56, 97, 114, 54, 51, 104, 52, 113, 101, 102, 116, 97,
          100, 112, 116, 103, 53, 114, 53, 113, 115, 119, 100, 42, 43, 111, 115,
          109, 111, 49, 117, 110, 102, 50, 114, 99, 121, 116, 106, 120, 102,
          112, 122, 56, 120, 56, 97, 114, 54, 51, 104, 52, 113, 101, 102, 116,
          97, 100, 112, 116, 103, 53, 116, 48, 110, 113, 99, 108, 50, 7, 8, 1,
          16, -27, -24, -8, 4, 56, -128, -37, -106, -82, -10, -63, -104, -73,
          23,
        ],
      },
    ],
    memo: '',
    source: null,
    fee: {
      gas: '300000',
      amount: [
        {
          denom: 'uatom',
          amount: '7500',
        },
      ],
    },
    signType: 'AMINO',
    rpcUrl: null,
  },
  rawTransfer: null,
};

export const Tx_Cosmos_Direct = {
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

export const TX_Solana = {
  type: 'SOLANA',
  blockChain: 'SOLANA',
  from: '9QoVnPEHj5HNL4cVicXUF8CVmyhBxTDqUUigVn3UPWwk',
  identifier: 'wrap',
  instructions: [
    {
      keys: [
        {
          pubkey: '9QoVnPEHj5HNL4cVicXUF8CVmyhBxTDqUUigVn3UPWwk',
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: '8esLH6GKjY57Z5cA517dLFEQMYztnCmKoME5fAYbcXVQ',
          isSigner: true,
          isWritable: true,
        },
      ],
      programId: '11111111111111111111111111111111',
      data: [
        0, 0, 0, 0, -80, 44, 53, 2, 0, 0, 0, 0, -91, 0, 0, 0, 0, 0, 0, 0, 6,
        -35, -10, -31, -41, 101, -95, -109, -39, -53, -31, 70, -50, -21, 121,
        -84, 28, -76, -123, -19, 95, 91, 55, -111, 58, -116, -11, -123, 126, -1,
        0, -87,
      ],
    },
    {
      keys: [
        {
          pubkey: '8esLH6GKjY57Z5cA517dLFEQMYztnCmKoME5fAYbcXVQ',
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: 'So11111111111111111111111111111111111111112',
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: '9QoVnPEHj5HNL4cVicXUF8CVmyhBxTDqUUigVn3UPWwk',
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: 'SysvarRent111111111111111111111111111111111',
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      data: [1],
    },
    {
      keys: [
        {
          pubkey: '8esLH6GKjY57Z5cA517dLFEQMYztnCmKoME5fAYbcXVQ',
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: 'CkaDQ9uC9Xe1jR9vwDooRCu4GnyLwM9gELuNLFkr8gK6',
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: '9QoVnPEHj5HNL4cVicXUF8CVmyhBxTDqUUigVn3UPWwk',
          isSigner: true,
          isWritable: false,
        },
      ],
      programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      data: [3, -64, 14, 22, 2, 0, 0, 0, 0],
    },
    {
      keys: [
        {
          pubkey: '8esLH6GKjY57Z5cA517dLFEQMYztnCmKoME5fAYbcXVQ',
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: '9QoVnPEHj5HNL4cVicXUF8CVmyhBxTDqUUigVn3UPWwk',
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: '9QoVnPEHj5HNL4cVicXUF8CVmyhBxTDqUUigVn3UPWwk',
          isSigner: true,
          isWritable: false,
        },
      ],
      programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      data: [9],
    },
  ],
  recentBlockhash: 'EhYGiuC7pG5oY6zvPwNbpWJ18ML2daX5dL7k5ssjpME3',
  signatures: [
    {
      publicKey: '8esLH6GKjY57Z5cA517dLFEQMYztnCmKoME5fAYbcXVQ',
      signature: [
        34, -61, 28, 94, 93, 9, -71, 10, -99, 89, 121, 11, 119, 126, 31, 86, 33,
        -10, -27, 28, -85, -126, -93, 23, 43, -86, -66, -8, 63, -94, -112, 25,
        -60, -86, 125, 31, -84, 64, 18, -72, 8, 68, -46, 5, -85, 20, 36, -123,
        90, -72, -40, 88, 106, -35, 96, -20, -89, -39, -46, 27, 23, 11, 93, 2,
      ],
    },
  ],
  serializedMessage: null,
  txType: 'LEGACY',
};
