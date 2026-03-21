export const measurePerformance = (metricName, callback) => {
  if (typeof window !== "undefined" && window.performance) {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log performance metrics
    // console.log(`Performance - ${metricName}:`, {
    //   duration: `${duration.toFixed(2)}ms`,
    //   timestamp: new Date().toISOString(),
    // });

    return result;
  }
  return callback();
};

export const trackPageLoad = () => {
  if (typeof window !== "undefined" && window.performance) {
    window.addEventListener("load", () => {
      const timing = performance.timing;
      const metrics = {
        pageLoad: timing.loadEventEnd - timing.navigationStart,
        domLoad: timing.domComplete - timing.domLoading,
        networkLatency: timing.responseEnd - timing.requestStart,
      };

      // console.log("Page Load Metrics:", metrics);
    });
  }
};

export const trackResourceTiming = () => {
  if (typeof window !== "undefined" && window.performance) {
    const resources = performance.getEntriesByType("resource");
    resources.forEach((resource) => {
      // console.log("Resource Timing:", {
      //   name: resource.name,
      //   duration: resource.duration,
      //   type: resource.initiatorType,
      // });
    });
  }
};
