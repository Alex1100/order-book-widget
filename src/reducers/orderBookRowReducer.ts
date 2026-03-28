import type { Flash } from '../types/orderBookTypes';

type UIState = {
  activeFlash?: Flash;
};

export const SET_ACTIVE_FLASH = 'SET_ACTIVE_FLASH';

type Action = { type: typeof SET_ACTIVE_FLASH; activeFlash?: Flash };

export const initialState: UIState = {
  activeFlash: undefined,
};

export const orderBookRowReducer = (state: UIState, action: Action): UIState => {
  switch (action.type) {
    case SET_ACTIVE_FLASH:
      return { ...state, activeFlash: action.activeFlash };
    default:
      return state;
  }
};
