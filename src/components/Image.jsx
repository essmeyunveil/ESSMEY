import { useState } from "react";
import { Skeleton } from "@chakra-ui/react";

const logError = (error, context) => {
  console.error(`[Image Component Error] ${context}:`, error);
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTracking(error, context);
  }
};

const Image = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  fallbackSrc = "/placeholder.png",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    try {
      setIsLoading(false);
      setError(false);
    } catch (error) {
      logError(error, "Image load");
      setIsLoading(false);
      setError(true);
    }
  };

  const handleError = () => {
    try {
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setIsLoading(true);
      } else {
        setIsLoading(false);
        setError(true);
      }
    } catch (error) {
      logError(error, "Image error");
      setIsLoading(false);
      setError(true);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height }}
      role="img"
      aria-label={alt || "Image"}
    >
      {isLoading && (
        <Skeleton
          height="100%"
          width="100%"
          position="absolute"
          top={0}
          left={0}
          borderRadius="inherit"
        />
      )}
      {error ? (
        <div
          className="w-full h-full flex items-center justify-center bg-gray-100"
          role="alert"
          aria-label="Image not available"
        >
          <span className="text-gray-400">Image not available</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt || ""}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          {...props}
        />
      )}
    </div>
  );
};

export default Image;
