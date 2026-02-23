export function getApiKeyFromEnv(): string | undefined {
  // NOTE: parcel doesn't support for dynamic keys, so we have to do it statically.
  return process.env.REACT_APP_RANGO_API_KEY;
}

/**
 * This is useful when the api key is mandatory and nothing works corectly without api key.
 * You need to first fallback to user's input (widget config), then you can use this to try to find from envs (e.g. widget/app or widget/playground)
 * Then throw an runtime error to panic the program.
 */
export function getApiKeyFromEnvOrThrow() {
  // NOTE: parcel doesn't support for dynamic keys, so we have to do it statically.
  const value = getApiKeyFromEnv();
  if (value) {
    return value;
  }

  throw new Error(
    'Ensure you have set REACT_APP_RANGO_API_KEY in your env variables.'
  );
}

/**
 * You can use this whenever you want to use the api key in initialize process, but mark the key explictly as not set to debug more easily since you should never reach there.
 */
export function getApiKeyFromEnvOrNotSet(): string {
  return getApiKeyFromEnv() || 'NOT_SET';
}
