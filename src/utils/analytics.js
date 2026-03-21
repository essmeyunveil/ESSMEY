import { toast } from "react-hot-toast";

const isDevelopment = process.env.NODE_ENV === "development";

export const initToast = () => {
  toast.configure({
    style: {
      background: '#fff',
      color: '#333',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    position: 'top-right'
  });
};

export const trackError = (error, context = "Unknown") => {
  console.error(`[Error] ${context}:`, error);
  if (isDevelopment) {
    toast.error(`Error in ${context}: ${error.message}`);
  }
};

export const trackPerformance = (metricName, duration) => {
  if (!isDevelopment) {
    // console.log(`[Performance] ${metricName}: ${duration.toFixed(2)}ms`);
    toast.success(`${metricName} completed in ${duration.toFixed(2)}ms`);
  }
};

export const withAnalytics = (callback) => {
  const start = performance.now();
  try {
    const result = callback();
    const duration = performance.now() - start;
    trackPerformance(callback.name || 'Anonymous', duration);
    return result;
  } catch (error) {
    trackError(error, callback.name || 'Anonymous');
    throw error;
  }
};
