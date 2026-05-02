import { vultisigZcash } from '../../utils.js';

export async function requestZcashAccounts() {
  return vultisigZcash().requestAccounts();
}

// Get accounts silently
export async function getZcashAccounts() {
  try {
    return await vultisigZcash().request({ method: 'get_accounts' });
  } catch (error) {
    console.error('error', error);
    return [];
  }
}
