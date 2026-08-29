import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const logError = (error, context) => {
  console.error(`[Firebase Error] ${context}:`, error);
  // In production, you would send this to your error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTracking(error, context);
  }
};

// Check for required environment variables only in production
const validateEnv = () => {
  if (import.meta.env.PROD) {
    const requiredEnvVars = [
      "VITE_FIREBASE_API_KEY",
      "VITE_FIREBASE_AUTH_DOMAIN",
      "VITE_FIREBASE_PROJECT_ID",
      "VITE_FIREBASE_STORAGE_BUCKET",
      "VITE_FIREBASE_MESSAGING_SENDER_ID",
      "VITE_FIREBASE_APP_ID",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !import.meta.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }
  }
};

try {
  validateEnv();
} catch (error) {
  logError(error, "Environment validation");
  // In development, continue with a mock auth to avoid hard crash
  if (!import.meta.env.PROD) {
    console.warn("Continuing in dev mode without Firebase credentials.");
  } else {
    throw error;
  }
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
try {
  // If running in production we expect valid config; in dev create app only if apiKey present
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "local") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // Provide a lightweight mock auth and DB objects to avoid runtime crashes in dev
    auth = { __isMock: true };
    db = { __isMock: true };
    storage = { __isMock: true };
  }
} catch (error) {
  logError(error, "Firebase initialization");
  if (!import.meta.env.PROD) {
    auth = { __isMock: true };
    db = { __isMock: true };
    storage = { __isMock: true };
  } else {
    throw new Error("Failed to initialize Firebase");
  }
}

export { auth, db, storage };

// Helper function to handle Firebase Auth operations with error handling
export const handleAuthError = (error) => {
  let errorMessage = "An error occurred during authentication";

  switch (error.code) {
    case "auth/invalid-email":
      errorMessage = "Invalid email address";
      break;
    case "auth/user-disabled":
      errorMessage = "This account has been disabled";
      break;
    case "auth/user-not-found":
      errorMessage = "No account found with this email";
      break;
    case "auth/wrong-password":
      errorMessage = "Incorrect password";
      break;
    case "auth/email-already-in-use":
      errorMessage = "Email is already in use";
      break;
    case "auth/weak-password":
      errorMessage = "Password is too weak";
      break;
    case "auth/operation-not-allowed":
      errorMessage = "This operation is not allowed";
      break;
    case "auth/network-request-failed":
      errorMessage = "Network error. Please check your connection";
      break;
    case "auth/too-many-requests":
      errorMessage = "Too many requests. Please try again later";
      break;
    case "auth/popup-closed-by-user":
      errorMessage = "Sign in was cancelled";
      break;
    case "auth/invalid-phone-number":
      errorMessage = "Invalid phone number format";
      break;
    case "auth/invalid-verification-code":
      errorMessage = "Incorrect OTP code. Please try again.";
      break;
    case "auth/code-expired":
      errorMessage = "OTP has expired. Please request a new one.";
      break;
    default:
      logError(error, "Authentication");
  }

  return errorMessage;
};
