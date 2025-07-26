<template>
  <Widget :config="config" />
</template>

<script lang="ts">
import { applyPureReactInVue } from "veaury";
import { Widget } from "@rango-dev/widget-embedded";

export default {
  components: {
    Widget: applyPureReactInVue(Widget),
  },
  setup() {
    return {
      config: {
        apiKey: "c6381a79-2817-4602-83bf-6a641a409e32",
        walletConnectProjectId: "e24844c5deb5193c1c14840a7af6a40b",
        variant: "full-expanded",
      },
    };
  },
};
</script>
