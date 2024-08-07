/*
 * It is not a good idea to re-export all of CAIP because if they have a breaking change, we will break as well.
 * It would be better to create an abstraction over them and export our own interface to ensure it is under our control.
 */
export * as CAIP from 'caip';

export { generateStoreId } from '../hub/helpers.js';
export * from './versions.js';
