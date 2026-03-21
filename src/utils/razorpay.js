// Simple utility function for Razorpay payment
export const openRazorpay = (options) => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay script is already loaded
    if (window.Razorpay) {
      initializeRazorpay(options, resolve, reject);
    } else {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onerror = () => {
        reject(new Error("Failed to load Razorpay script"));
      };
      script.onload = () => {
        initializeRazorpay(options, resolve, reject);
      };
      document.body.appendChild(script);
    }
  });
};

const initializeRazorpay = (options, resolve, reject) => {
  try {
    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: options.amount,
      currency: options.currency || "INR",
      name: options.name || "Essmey Perfume",
      description: options.description || "Payment for your order",
      order_id: options.orderId,
      handler: function (response) {
        resolve(response);
      },
      prefill: {
        name: options.prefill?.name || "",
        email: options.prefill?.email || "",
        contact: options.prefill?.contact || "",
      },
      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function () {
          reject(new Error("Payment cancelled by user"));
        },
      },
    });

    rzp.on("payment.failed", function (response) {
      reject(new Error(response.error.description || "Payment failed"));
    });

    rzp.open();
  } catch (error) {
    reject(error);
  }
};
