import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const logError = (error, context) => {
  console.error(`[ScrollToTop Error] ${context}:`, error);
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTracking(error, context);
  }
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      // Check if the browser supports smooth scrolling
      const supportsSmoothScroll =
        "scrollBehavior" in document.documentElement.style;

      if (supportsSmoothScroll) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      } else {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
      }
    } catch (error) {
      logError(error, "Scrolling");
      // Fallback to basic scrolling if smooth scroll fails
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
