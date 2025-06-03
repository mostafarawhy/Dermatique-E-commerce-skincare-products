export const initialState = {
  searchQuery: "",
  searchLoading: false,
  results: [],
  suggestions: [],
  error: null,
};

function searchReducer(state, action) {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_LOADING":
      return { ...state, searchLoading: action.payload };
    case "SET_RESULTS":
      return { ...state, results: action.payload };
    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_SEARCH":
      return initialState;
    default:
      return state;
  }
}

export default searchReducer;
