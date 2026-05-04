import { vultisigZcash } from '../../utils.js';

export async function requestZcashAccounts() {
  return vultisigZcash().requestAccounts();
}

// Get accounts silently
export async function getZcashAccounts() {
  return await vultisigZcash().request({ method: 'get_accounts' });
}
