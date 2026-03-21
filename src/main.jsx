import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const logError = (error, context) => {
  console.error(`[Main Error] ${context}:`, error);
  // In production, you would send this to your error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTracking(error, context);
  }
};

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Failed to find root element");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  logError(error, "Application initialization");
  // Show a user-friendly error message
  const errorElement = document.createElement("div");
  errorElement.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    color: #dc3545;
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    text-align: center;
  `;
  errorElement.innerHTML = `
    <h1 style="font-size: 2rem; margin-bottom: 1rem;">Something went wrong</h1>
    <p style="margin-bottom: 1rem;">We're sorry, but the application failed to load. Please try refreshing the page.</p>
    <button 
      onclick="window.location.reload()" 
      style="
        padding: 0.5rem 1rem;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
      "
    >
      Refresh Page
    </button>
  `;
  document.body.appendChild(errorElement);
}
