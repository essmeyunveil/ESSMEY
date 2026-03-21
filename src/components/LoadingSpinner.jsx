import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[100px]">
      <div
        className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"
        aria-label="Loading spinner"
      ></div>
      <div className="mt-2 text-primary text-lg font-semibold">Loading...</div>
    </div>
  );
}
