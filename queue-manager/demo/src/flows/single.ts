import { RangoClient } from "rango-sdk-basic";
import { connect, signEvmTx, switchNetwork } from "../wallet";
import { QueueDef } from "@rangodev/queue-manager-core";

const RANGO_API_KEY = "4a624ab5-16ff-4f96-90b7-ab00ddfc342c";
const rangoClient = new RangoClient(RANGO_API_KEY);

export async function connectWallet(actions) {
  try {
    await connect();
    actions.next();
  } catch (e) {
    console.log("failed on connect.", e);
    actions.failed();
  }
}
export async function changeNetworkToPolygon(actions) {
  try {
    // 137 = Polygon
    await switchNetwork("0x89");
    actions.next();
  } catch (e) {
    console.log("failed on connect.", e);
    actions.failed();
  }
}

export async function swapUsdcToUsdt(actions) {
  try {
    const from = {
      blockchain: "POLYGON",
      symbol: "USDC",
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    };
    const to = {
      blockchain: "POLYGON",
      symbol: "USDT",
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    };

    // @ts-ignore
    const swapResponse = await rangoClient.swap({
      from,
      to,
      amount: "5000000",
      fromAddress: "0x2702d89c1c8658B49C45dd460DeebCc45fAeC03C",
      toAddress: "0x2702d89c1c8658B49C45dd460DeebCc45fAeC03C",
      disableEstimate: false,
      slippage: "1.0",
    });

    let hash = await signEvmTx(swapResponse.tx);

    console.log({ hash });

    actions.schedule("checkStatus");
    actions.next();
  } catch (e) {
    console.log("failed to make tx.", e);
    actions.failed();
  }
}

function checkStatus(actions) {
  console.log("check");
  actions.next();
}

const simpleSwapQueueDefinition: QueueDef = {
  name: "simpleSwap",
  actions: {
    connectWallet,
    changeNetworkToPolygon,
    swapUsdcToUsdt,
    checkStatus,
  },
  events: {
    onUpdate(event) {
      console.log({ event });
    },
  },
  run: ["connectWallet", "changeNetworkToPolygon", "swapUsdcToUsdt"],
};

export { simpleSwapQueueDefinition };
