import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const logError = (error, context) => {
  console.error(`[Firebase Error] ${context}:`, error);
  // In production, you would send this to your error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTracking(error, context);
  }
};

// Check for required environment variables
const validateEnv = () => {
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
};

try {
  validateEnv();
} catch (error) {
  logError(error, "Environment validation");
  throw error;
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
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  logError(error, "Firebase initialization");
  throw new Error("Failed to initialize Firebase");
}

// Initialize Firebase Auth
let auth;
try {
  auth = getAuth(app);
} catch (error) {
  logError(error, "Firebase Auth initialization");
  throw new Error("Failed to initialize Firebase Auth");
}

export { auth };

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
    default:
      logError(error, "Authentication");
  }

  return errorMessage;
};
