import { createContext, useContext, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
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

  // Search function using Firestore
  const handleSearch = async (queryStr) => {
    if (!queryStr.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const lowerQuery = queryStr.toLowerCase();

      if (db.__isMock) {
        setSearchResults([]);
        return;
      }

      const querySnapshot = await getDocs(collection(db, "products"));
      const allProducts = [];
      querySnapshot.forEach((doc) => {
        allProducts.push({ _id: doc.id, ...doc.data() });
      });

      const filtered = allProducts
        .filter(
          (product) =>
            product.name?.toLowerCase().includes(lowerQuery) ||
            product.category?.toLowerCase().includes(lowerQuery)
        )
        .map((p) => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          image: p.thumbnail || (p.images && p.images[0]) || "",
        }));

      setSearchResults(filtered);
    } catch (err) {
      console.error("Error fetching search results from Firestore:", err);
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
