import * as varialApi from '@stellar/varial-sdk';

export async function checkInstallation(): Promise<boolean> {
  const result = await varialApi.isConnected();

  return result.isConnected;
}
