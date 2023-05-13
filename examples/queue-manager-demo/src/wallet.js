import { providers } from 'ethers';

const { ethereum } = window;

let activeAccount = null;

export async function connect(){
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  activeAccount = accounts[0];
  console.log("connected", activeAccount)
}


export async function switchNetwork(chainId){
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId}],
  });

  console.log("network switched.")
}


export async function signEvmTx(evmTransaction){
  let provider = new providers.Web3Provider(ethereum);
  let signer = provider.getSigner();

  let tx = {};
  if (!!evmTransaction.from) tx = { ...tx, from: evmTransaction.from };
  if (!!evmTransaction.txTo) tx = { ...tx, to: evmTransaction.txTo };
  if (!!evmTransaction.txData) tx = { ...tx, data: evmTransaction.txData };
  if (!!evmTransaction.value) tx = { ...tx, value: evmTransaction.value };
  if (!!evmTransaction.gasLimit) tx = { ...tx, gasLimit: evmTransaction.gasLimit };
  if (!!evmTransaction.gasPrice) tx = { ...tx, gasPrice: evmTransaction.gasPrice };
  if (!!evmTransaction.nonce) tx = { ...tx, nonce: evmTransaction.nonce };

  const tr = await signer.sendTransaction(tx);
  return tr.hash;
}

// Switch network
// Make a transaction and run
// check status from server
// notif the resul