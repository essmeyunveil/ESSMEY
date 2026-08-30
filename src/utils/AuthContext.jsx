import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useUser, useAuth as useClerkAuth, useClerk } from "@clerk/clerk-react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useToastContext } from "./ToastContext";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isLoaded: isUserLoaded, isSignedIn, user: clerkUser } = useUser();
  const { isLoaded: isAuthLoaded } = useClerkAuth();
  const clerk = useClerk();
  const { addToast } = useToastContext() || {};

  const [cartSynced, setCartSynced] = useState(false);

  // Map Clerk user object to the application's user interface
  const user = useMemo(() => {
    if (!isSignedIn || !clerkUser) return null;

    const email = clerkUser.primaryEmailAddress?.emailAddress || "";
    const displayName =
      clerkUser.fullName ||
      clerkUser.firstName ||
      clerkUser.username ||
      (email ? email.split("@")[0] : "Customer");

    return {
      uid: clerkUser.id,
      id: clerkUser.id,
      email,
      displayName,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      imageUrl: clerkUser.imageUrl,
      photoURL: clerkUser.imageUrl,
      clerkUser,
    };
  }, [isSignedIn, clerkUser]);

  const loading = !isUserLoaded || !isAuthLoaded;

  // Sync guest cart with user Firestore cart on login
  const syncCart = useCallback(
    async (currentUser) => {
      if (!currentUser || cartSynced || db.__isMock) return;

      try {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartDocRef = doc(db, "userCarts", currentUser.uid);
        const cartDocSnap = await getDoc(cartDocRef);

        if (cartDocSnap.exists()) {
          const dbCartData = cartDocSnap.data();
          const mergedCart = [...(dbCartData.items || [])];

          savedCart.forEach((localItem) => {
            const exists = mergedCart.some(
              (dbItem) =>
                dbItem._id === localItem._id &&
                dbItem.selectedSize === localItem.selectedSize
            );
            if (!exists) {
              mergedCart.push(localItem);
            }
          });

          localStorage.setItem("cart", JSON.stringify(mergedCart));
          await updateDoc(cartDocRef, {
            items: mergedCart,
            lastUpdated: new Date().toISOString(),
          });
        } else if (savedCart.length > 0) {
          await setDoc(cartDocRef, {
            userId: currentUser.uid,
            items: savedCart,
            lastUpdated: new Date().toISOString(),
          });
        }

        setCartSynced(true);
      } catch (error) {
        // Silently skip cart cloud sync if offline or permissions pending
        setCartSynced(true);
      }
    },
    [cartSynced]
  );

  useEffect(() => {
    if (user?.uid) {
      syncCart(user);
    } else {
      setCartSynced(false);
    }
  }, [user, syncCart]);

  // Sign out method
  const logout = useCallback(async () => {
    try {
      await clerk.signOut();
      if (addToast) {
        addToast("You have been signed out successfully.", "info");
      } else {
        toast.success("You have been signed out successfully.");
      }
    } catch (err) {
      console.error("[Clerk Logout Error]:", err);
      toast.error("Failed to sign out. Please try again.");
    }
  }, [clerk, addToast]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      logout,
      clerk,
    }),
    [user, loading, logout, clerk]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

