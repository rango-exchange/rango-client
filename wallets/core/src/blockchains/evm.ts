import { BlockchainProvider } from '../hub';

type ChainId = string;
interface Config {
  category: string;
  defaultChainId: ChainId;
}

function evm(config: Config) {
  const b = new BlockchainProvider({
    category: config.category,
  });

  b.and('connect', connect);

  return b;
}

// It will only update states.
function connect(result) {
  // todo
}

export { evm };
