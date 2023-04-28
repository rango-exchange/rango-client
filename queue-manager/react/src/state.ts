import { useReducer } from 'react';
import { ManagerState } from './types';

type Update<T> = (name: keyof T, value: T[keyof T]) => void;
type Action<T> = { type: 'UPDATE'; name: keyof T; value: T[keyof T] };

export const initState: ManagerState = {
  loadedFromPersistor: false,
};

function reducer(state: ManagerState, action: Action<ManagerState>) {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, [action.name]: action.value };
    default:
      return state;
  }
}

export function useManagerState(): {
  state: ManagerState;
  update: Update<ManagerState>;
} {
  const [state, dispatch] = useReducer(reducer, initState);

  return {
    state,
    update: (name, value) => {
      dispatch({
        type: 'UPDATE',
        name,
        value,
      });
    },
  };
}
