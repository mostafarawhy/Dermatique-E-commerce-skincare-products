import { createContext } from "react";
import { useSearch } from "../hooks/useSearch";

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const { state, handleSearch, debouncedSearch, clearSearch, setSearchQuery } =
    useSearch();
  return (
    <SearchContext.Provider
      value={{
        state,
        handleSearch,
        debouncedSearch,
        clearSearch,
        setSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
