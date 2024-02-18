export const PROJECT_ID = process.env.CROWDIN_PROJECT_ID;
export const TOKEN =  process.env.CROWDIN_PERSONAL_TOKEN;

export const BASE_URL = `https://api.crowdin.com/api/v2`;
export const PROJECT_API = `${BASE_URL}/projects/${PROJECT_ID}`;
export const PRETRANSLATE_API = `${PROJECT_API}/pre-translations`
export const FILE_API = `${PROJECT_API}/files`
export const MACHINE_TRANSLATE_API = `${BASE_URL}/mts`;

export const REQUEST_INTERVAL_TIMEOUT = 10_000;
export const MAXIMUM_PRETRANSLATION_STATUS_CHECK = 20;