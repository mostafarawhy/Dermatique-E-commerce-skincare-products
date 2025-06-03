import {
  TOGGLE_DRAWER,
  SET_DRAWER,
  CLOSE_ALL,
  initialState,
} from "../constants";



function drawersReducer(state, action) {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return { ...state, [action.drawer]: !state[action.drawer] };
    case SET_DRAWER:
      return { ...state, [action.drawer]: action.value };
    case CLOSE_ALL:
      return { initialState };

    default:
      return state;
  }
}

export default drawersReducer;
