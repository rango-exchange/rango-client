import { CrowdinError } from "../common/errors.mjs";
import { fetchDataWithAuthorization } from "./utils.mjs";

import { 
  MAXIMUM_PRETRANSLATION_STATUS_CHECK,
  PRETRANSLATE_API, 
  REQUEST_INTERVAL_TIMEOUT, 
  FILE_API,
  MACHINE_TRANSLATE_API,
  PROJECT_API,
} from "./constants.mjs";


export const getMachineTranslationEngineID = async () =>{
  const responseData = await fetchDataWithAuthorization(MACHINE_TRANSLATE_API);
  if(!responseData.data || !responseData.data.length){
    throw new CrowdinError('No data received for machine translation');
  }
  return responseData.data[0].data.id;
}

export const getLanguageIds = async () => {
  const responseData = await fetchDataWithAuthorization(PROJECT_API);
  return responseData.data.targetLanguageIds;
};

export const getSourceFileId = async () => {
  const responseData = await fetchDataWithAuthorization(FILE_API);
  if (!responseData.data || !responseData.data.length) {
    throw new CrowdinError('No data received for source file id');
  }
  return responseData.data[0].data.id;
};

export const sendPreTranslateRequest = async ({ sourceFileId, languageIds, preTranslationOption }) => {
  const responseData = await fetchDataWithAuthorization(PRETRANSLATE_API, 'POST', {
    ...preTranslationOption,
    fileIds: [sourceFileId],
    languageIds,
  });
  return responseData.data.identifier;
};

export const checkPreTranslateStatus = async (preTranslationId) => {
  const maxAttempts = MAXIMUM_PRETRANSLATION_STATUS_CHECK;
  let attempt = 0;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  while (attempt < maxAttempts) {
    const responseData = await fetchDataWithAuthorization(`${PRETRANSLATE_API}/${preTranslationId}`);
    const status = responseData.data.status;
    if (status === 'finished') {
      return status;
    } else {
      console.log(`Pre-translation status: ${status}. Retrying in 10 seconds...`);
      await delay(REQUEST_INTERVAL_TIMEOUT);
      attempt++;
    }
  }
  throw new CrowdinError('Timeout: Pre-translation did not succeed within the specified time.');
};