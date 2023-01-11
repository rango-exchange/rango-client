import { useManager } from "@rangodev/queue-manager-react";
import React, { useEffect, useState } from "react";
import { BigNumber } from "bignumber.js";
import {
  calculatePendingSwap,
  getBestRoute,
  requestSwap,
  urlToToken,
} from "../../flows/rango/helpers";
import { PendingSwap, WalletTypeAndAddress } from "../../flows/rango/types";
import { FlowRunner } from "../FlowRunner";
import { sampleRawAccounts, metamaskWallet } from "../../flows/rango/mock";
import { WalletType } from "@rangodev/wallets-shared";

interface PropTypes {
  connectedWallets: WalletType[];
}

function FlowsList(props: PropTypes) {
  const { manager } = useManager();
  const [fromToken, setFrom] = useState(
    "FANTOM.USDC--0x04068da6c83afcfa0e13ba15a6696662335d5b75"
  );
  const [toToken, setTo] = useState("COSMOS.ATOM");
  const [input, setInput] = useState("10");

  useEffect(() => {
    manager?.run();
  }, []);

  useEffect(() => {
    if (props.connectedWallets.length) {
      console.log("[React] run retry on `props.connectedWallets`");
      manager?.retry();
    }
  }, [props.connectedWallets]);

  const flows = [
    {
      title: "Single Wallet",
      description: "Run a simple swap by metamask",
      requirements: ["Use metamsk", "Change your network to ethereum."],
      onRun: () => {
        const qId = manager?.create("simpleSwap", {});
        console.debug(`[Queue] created. ID: ${qId}`, manager);
      },
    },
    {
      title: "Rango Swap (On-chain)",
      description: "Run a swap using Rango flow.",
      requirements: ["Please use Metamask & Keplr", "USDC -> USDT"],
      onRun: async () => {
        const from = urlToToken(
          "POLYGON.USDC--0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
        )!;
        const to = urlToToken(
          "POLYGON.USDT--0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
        )!;
        const swap = await requestSwap("2", from, to);
        //   toast({ eventType: 'swap_started', swap: newSwap, step: newSwap.steps[0] });
        const qId = manager?.create("rango-swap", {
          swapDetails: swap,
        });
        console.debug(`[Queue] Swap created. ID: ${qId}`, manager);
      },
    },
    {
      title: "Rango Swap (Cross-chain)",
      description: "Run a swap using Rango flow.",
      requirements: ["Please use Metamask & Keplr (cosmos) for now."],
      children: (
        <div>
          <div>
            From:
            <input
              type="text"
              value={fromToken}
              onChange={(e) => {
                setFrom(e.target.value);
              }}
            />
          </div>
          <div>
            To:
            <input
              type="text"
              value={toToken}
              onChange={(e) => {
                setTo(e.target.value);
              }}
            />
          </div>
          <div>
            Amount:
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
          </div>
        </div>
      ),
      onRun: async () => {
        const from = urlToToken(fromToken)!;
        const to = urlToToken(toToken)!;
        const swap = await requestSwap(input, from, to);
        //   toast({ eventType: 'swap_started', swap: newSwap, step: newSwap.steps[0] });
        const qId = manager?.create("rango-swap", {
          swapDetails: swap,
        });
        console.debug(`[Queue] Swap created. ID: ${qId}`, manager);
      },
    },
    {
      title: "Rango Parallel Swaps",
      description: "Run multiple swaps at the same time using Rango flow.",
      requirements: [
        "Please use Metamask & Keplr (cosmos) for now.",
        "FTM -> ATOM and USDC -> USDT on polygon",
      ],
      onRun: async () => {
        const from1 = urlToToken(
          "POLYGON.USDC--0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
        )!;
        const to1 = urlToToken(
          "POLYGON.USDT--0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
        )!;
        const from2 = urlToToken(
          "FANTOM.USDC--0x04068da6c83afcfa0e13ba15a6696662335d5b75"
        )!;
        const to2 = urlToToken("COSMOS.ATOM")!;
        const swap1 = await requestSwap("2", from1, to1);
        const swap2 = await requestSwap("10", from2, to2);

        //   toast({ eventType: 'swap_started', swap: newSwap, step: newSwap.steps[0] });
        const qId = manager?.create("rango-swap", { swapDetails: swap1 });
        const q2Id = manager?.create("rango-swap", { swapDetails: swap2 });
        console.debug(`[Queue] Swap created. ID: ${qId}`);
        console.debug(`[Queue] Swap created. ID: ${q2Id}`);
      },
    },
  ];

  return (
    <div className="list">
      {flows.map((flow, i) => (
        <FlowRunner key={`flow-${i}`} {...flow} />
      ))}
    </div>
  );
}

export { FlowsList };
