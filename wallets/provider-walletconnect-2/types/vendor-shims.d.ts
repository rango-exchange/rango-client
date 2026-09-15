/*
 * rango vendor shims — required ONLY because this package sets `skipLibCheck: false`.
 * Each declaration suppresses a hard error from a THIRD-PARTY declaration file (not our code),
 * widening an unusable/missing type to `unknown`. They exist purely to make `tsc` pass and can
 * all be deleted if `skipLibCheck: true` is ever restored.
 */

/*
 * @reown/appkit's TypesUtil.d.ts type-imports `AppKitSIWEClient` from the OPTIONAL
 * @reown/appkit-siwe package (Sign-In-With-Ethereum), which we neither install nor use and
 * which has no @types package. Without this: TS2307 / TS2709.
 */
declare module '@reown/appkit-siwe' {
  export type AppKitSIWEClient = unknown;
}

/*
 * @reown/appkit-common's NumberUtil.d.ts does `import Big from 'big.js'` and uses `Big` and
 * `Big.Big` as types. big.js ships no types and we don't install @types/big.js (doing so drifts
 * the lockfile and downgrades valibot). Minimal class+namespace shim covers the three usages.
 * Without this: TS7016. (Stricter alternative: add @types/big.js as a devDependency.)
 */
declare module 'big.js' {
  class Big {
    constructor(value?: number | string | Big);
    [key: string]: unknown;
  }
  namespace Big {
    type Big = unknown;
  }
  export default Big;
}
