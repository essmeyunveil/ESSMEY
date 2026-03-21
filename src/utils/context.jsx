import { createContext, useContext, useState } from "react";
import { client } from "./sanity";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Search function using Sanity
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const lowerQuery = query.toLowerCase();
      const groqQuery = `*[_type == "product" && name match $searchTerm]{
        _id,
        name,
        price,
        "image": images[0].asset->url
      }`;
      const results = await client.fetch(groqQuery, {
        searchTerm: "*" + lowerQuery + "*",
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results from Sanity:", error);
      setError("Failed to fetch search results");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        setIsAuthenticated,
        searchResults,
        handleSearch,
        error,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
