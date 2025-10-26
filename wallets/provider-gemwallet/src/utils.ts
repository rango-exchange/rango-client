import { isInstalled } from '@gemwallet/api';

export async function checkInstallationOnLoad(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', () => {
      isInstalled()
        .then((response) => {
          if (response.result.isInstalled) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(reject);
    });
  });
}
