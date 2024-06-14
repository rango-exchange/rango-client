/*
 * CAIP has typescript types but unfortunately there is a bug and misconfiguration on their package.json
 * This is a workaround to skip types for this package.
 */
declare module 'caip';
