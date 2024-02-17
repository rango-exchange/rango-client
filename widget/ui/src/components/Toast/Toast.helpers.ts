export function idGenerator() {
  let id = 1;
  return () => {
    id++;
    return id;
  };
}

export const TOAST_UNMOUNT_DELAY = 500; // the delay before the toast is unmounted
export const TOAST_TRANSITION_DURATION = 300; // the duration of the toast transition
export const HOVER_TRANSITION_DURATION = 200; // the duration of the toast transition hover
export const TOAST_HIDE_DELAY = 200; // the delay before the toast is invisible to shift remained toast smoothly
