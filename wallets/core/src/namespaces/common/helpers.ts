import { AccountId } from 'caip';

export function isValidCaipAddress(address: string): boolean {
  try {
    AccountId.parse(address);
    return true;
  } catch {
    return false;
  }
}
