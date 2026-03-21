import React from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Toast({ message, type = "info", onClose }) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-200 text-green-800";
      case "error":
        return "bg-red-100 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-100 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-100 border-blue-200 text-blue-800";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`${getBgColor()} border rounded-lg shadow-lg p-4 flex items-center gap-2 min-w-[300px]`}
      >
        <div className="flex-1">{message}</div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="p-1 hover:opacity-70"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 