import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useToastContext } from "../utils/ToastContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, handleAuthError } from "./firebase";
import { client } from "./sanity";
import LoadingSpinner from "../components/LoadingSpinner";

const logError = (error, context) => {
  console.error(`[Auth Error] ${context}:`, error);
  // In production, you would send this to your error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTracking(error, context);
  }
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { addToast } = useToastContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartSynced, setCartSynced] = useState(false);

  const syncCart = useCallback(
    async (currentUser) => {
      if (!currentUser || cartSynced) return;

      try {
        // Get cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Get user's cart from Sanity
        const sanityCart = await client.fetch(
          `*[_type == "userCart" && userId == $userId][0]`,
          { userId: currentUser.uid }
        );

        if (sanityCart) {
          // Merge carts - prioritize items from Sanity
          const mergedCart = [...sanityCart.items];

          // Add items from localStorage that aren't in Sanity cart
          savedCart.forEach((localItem) => {
            const exists = mergedCart.some(
              (sanityItem) =>
                sanityItem._id === localItem._id &&
                sanityItem.selectedSize === localItem.selectedSize
            );
            if (!exists) {
              mergedCart.push(localItem);
            }
          });

          // Update localStorage with merged cart
          localStorage.setItem("cart", JSON.stringify(mergedCart));

          // Update Sanity with merged cart
          await client
            .patch(sanityCart._id)
            .set({
              items: mergedCart,
              lastUpdated: new Date().toISOString(),
            })
            .commit();
        } else if (savedCart.length > 0) {
          // If no Sanity cart exists but there's a local cart, create one
          await client.create({
            _type: "userCart",
            userId: currentUser.uid,
            items: savedCart,
            lastUpdated: new Date().toISOString(),
          });
        }

        setCartSynced(true);
      } catch (error) {
        logError(error, "Cart sync");
      }
    },
    [cartSynced]
  );

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        setError(null);
        await syncCart(currentUser);
      },
      (error) => {
        logError(error, "Auth state change");
        setError(handleAuthError(error));
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [syncCart]);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return result;
    } catch (error) {
      logError(error, "Login");
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Signup function
  const signup = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setLoading(false);
      return result;
    } catch (error) {
      logError(error, "Signup");
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Google login function
  const googleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setLoading(false);
      return result;
    } catch (error) {
      logError(error, "Google login");
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);
      const result = await sendPasswordResetEmail(auth, email);
      setLoading(false);
      return result;
    } catch (error) {
      logError(error, "Password reset");
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signOut(auth);
      
      // Show logout success toast
      if (user) {
        const userName = user.email.split('@')[0];
        addToast(`${userName} has successfully been logged out`, );
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      logError(error, "Logout");
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    googleLogin,
    forgotPassword,
    logout,
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (loading) {
    return <LoadingSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
