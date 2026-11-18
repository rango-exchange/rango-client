<template>
  <Widget :config="config" />
</template>

<script lang="ts">
import { applyPureReactInVue } from "veaury";
import { allProviders, WalletTypes } from "@rango-dev/provider-all";
import { Widget } from "@rango-dev/widget-embedded";

// Built once, outside the component: providers hold state.
const wallets = allProviders({
  [WalletTypes.WALLET_CONNECT_2]: {
    WC_PROJECT_ID: "e24844c5deb5193c1c14840a7af6a40b",
  },
}).map((build) => build());

export default {
  components: {
    Widget: applyPureReactInVue(Widget),
  },
  setup() {
    return {
      config: {
        apiKey: "c6381a79-2817-4602-83bf-6a641a409e32",
        variant: "full-expanded",
        wallets,
      },
    };
  },
};
</script>
