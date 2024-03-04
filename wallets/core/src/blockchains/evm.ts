import { BlockchainProvider } from '../hub';

type ChainId = string;
interface Config {
  id: string;
  defaultChainId: ChainId;
}

function evm(config: Config) {
  const b = new BlockchainProvider({
    id: config.id,
  });

  b.and('connect', connect);

  return b;
}

// It will only update states.
function connect(result) {
  // todo
}

export { evm };
