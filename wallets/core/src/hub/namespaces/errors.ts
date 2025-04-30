export const ACTION_NOT_FOUND_ERROR = (name: string) =>
  `Couldn't find "${name}" action. Are you sure you've added the action?`;

export const OR_ELSE_ACTION_FAILED_ERROR = (name: string) =>
  `An error occurred during running ${name}`;

export const BEFORE_ACTION_FAILED_ERROR = (name: string) =>
  `An error occurred during running before for "${name}" action`;

export const NO_STORE_FOUND_ERROR =
  'For setup store, you should set `store` first.';
