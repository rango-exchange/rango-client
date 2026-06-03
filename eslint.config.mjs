import rangoRules from 'eslint-config-rango';

export default [
  {
    ignores: ['examples/**', 'global-wallets-env.d.ts']
  },
  ...rangoRules
];