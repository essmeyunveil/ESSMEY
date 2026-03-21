import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    // If no orderId in state, redirect to home or show message
    return (
      <div className="pt-28 pb-20 min-h-[60vh] flex flex-col items-center">
        <h2 className="text-3xl font-serif font-bold mb-4">No Order Found</h2>
        <p className="mb-6">
          It seems you have not placed an order. Please place an order first.
        </p>
        <button className="btn-primary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-[60vh] flex flex-col items-center">
      <h2 className="text-3xl font-serif font-bold mb-4">
        Thank You for Your Order!
      </h2>
      <p className="mb-6">
        Your Order ID is <strong>{orderId}</strong>.
      </p>
      <p className="mb-6">You'll receive order updates via email/SMS.</p>
      <button className="btn-primary" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default ThankYou;
