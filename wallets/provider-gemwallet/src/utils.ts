import { isInstalled } from '@gemwallet/api';

export async function checkInstallationOnLoad(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const checkInstallation = () => {
      isInstalled()
        .then((response) => {
          if (response.result.isInstalled) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(reject);
    };

    if (document.readyState === 'complete') {
      checkInstallation();
    } else {
      window.addEventListener('load', checkInstallation, { once: true });
    }
  });
}
