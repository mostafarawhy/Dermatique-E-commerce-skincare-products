import { useCallback, useReducer, useRef, useState, useEffect } from "react";
import searchReducer, { initialState } from "../reducers/searchReducer";
import api from "../api";
export function useSearch() {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const debounceTimerRef = useRef();
  const abortControllerRef = useRef();

  const handleSearch = useCallback(async (value) => {
    if (!value?.trim()) {
      dispatch({ type: "SET_RESULTS", payload: [] });
      dispatch({ type: "SET_SUGGESTIONS", payload: [] });
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const suggestionsResponse = await api.get("/search/suggestions", {
        params: { q: value },
        signal: abortControllerRef.current.signal,
      });
      const searchResponse = await api.get("/search/products", {
        params: { q: value },
        signal: abortControllerRef.current.signal,
      });

      dispatch({
        type: "SET_SUGGESTIONS",
        payload: suggestionsResponse.data.suggestions,
      });

      dispatch({ type: "SET_RESULTS", payload: searchResponse.data.products });
    } catch (error) {
      if (error.name === "CanceledError") return;
      dispatch({
        type: "SET_ERROR",
        payload: "Search failed. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const debouncedSearch = useCallback(
    (value) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        handleSearch(value);
      }, 300);
    },
    [handleSearch]
  );

  const clearSearch = useCallback(() => {
    dispatch({ type: "CLEAR_SEARCH" });
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const setSearchQuery = (query) => {
    dispatch({ type: "SET_QUERY", payload: query });
  };
  return {
    state,
    handleSearch,
    debouncedSearch,
    clearSearch,
    setSearchQuery,
  };
}
