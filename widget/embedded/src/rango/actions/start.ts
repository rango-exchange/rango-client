import { ActionParams } from '../types';

export function start({ next }: ActionParams): void {
  console.log('ready to go....');
  next();
}
