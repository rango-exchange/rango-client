import * as freighterApi from '@stellar/freighter-api';

export async function checkInstallation(): Promise<boolean> {
  const result = await freighterApi.isConnected();

  return result.isConnected;
}
