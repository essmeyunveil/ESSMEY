import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const calculateDeliveryStatus = (placedAt) => {
  const placedDate = new Date(placedAt);
  const now = new Date();
  const diffTime = now - placedDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 2) return "Order Confirmed";
  if (diffDays < 5) return "In Transit";
  if (diffDays < 9) return "Out for Delivery Soon";
  if (diffDays <= 10) return "Out for Delivery";
  return "Delivered";
};

export default function TransOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      setOrder(null);
      const trimmedOrderId = orderId.trim();
      // console.log("Searching for orderId:", trimmedOrderId);

      if (!trimmedOrderId) {
        setError("Please enter your Order ID.");
        return;
      }

      if (db.__isMock) {
        setError("Firebase is running in local MOCK mode.");
        return;
      }

      const docRef = doc(db, "orders", trimmedOrderId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError(
          "No order found with this ID. Please check the ID and try again. If the problem persists, contact support."
        );
        return;
      }

      const data = docSnap.data();
      const result = {
        ...data,
        _id: docSnap.id,
        totalAmount: data.totalAmount || data.total,
        placedAt: data.placedAt || data.createdAt,
      };

      setOrder(result);
      setStatus(
        result.deliveryStatus
          ? result.deliveryStatus === "confirmed"
            ? "Order Confirmed"
            : result.deliveryStatus === "in_transit"
            ? "In Transit"
            : result.deliveryStatus === "delivered"
            ? "Delivered"
            : result.deliveryStatus
          : calculateDeliveryStatus(result.placedAt)
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-8 font-sans">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10 mx-4">
        <h1 className="text-3xl font-serif font-bold text-amber-600 mb-8 text-center tracking-wide">
          Track Your Order
        </h1>
        <div className="mb-2 text-sm text-amber-700 text-center">
          <div>
            Enter the Order ID you received after purchase. (e.g., ESS12345678)
          </div>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter your Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full p-4 text-lg rounded-xl border border-amber-200 bg-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchOrder();
            }}
          />
          <button
            onClick={fetchOrder}
            className="mt-4 w-full py-3 bg-amber-600 text-white font-semibold text-lg rounded-xl hover:bg-amber-700 transition"
            disabled={orderId.trim() === ""}
          >
            Track Order
          </button>
        </div>

        {error && (
          <div className="text-red-700 bg-red-100 rounded-lg p-3 text-center font-medium mb-6">
            {error}
          </div>
        )}

        {order && (
          <div className="bg-amber-50 rounded-xl p-6 shadow-inner text-amber-800 font-medium space-y-3">
            <h2 className="text-xl font-serif font-bold text-amber-700 mb-4 text-center">
              Order Details
            </h2>
            <p>
              <span className="font-semibold">Order ID: </span>
              {order.orderId}
            </p>
            <p>
              <span className="font-semibold">Name: </span>
              {order.customerName}
            </p>
            <p>
              <span className="font-semibold">Total: </span>₹{order.totalAmount}
            </p>
            <p>
              <span className="font-semibold">Placed On: </span>
              {new Date(order.placedAt).toDateString()}
            </p>
            <p>
              <span className="font-semibold">Status: </span>
              {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
