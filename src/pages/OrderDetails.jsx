import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuth } from "../utils/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const FALLBACK_IMAGE = "/images/product-1.jpg";

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

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Auth guard: redirect to login if not authenticated ──────────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", {
        state: {
          from: `/order/${orderId}`,
          message: "Please log in to view your order details.",
        },
        replace: true,
      });
    }
  }, [authLoading, user, navigate, orderId]);

  // ── Fetch order only once auth has resolved and user is present ─────────────
  useEffect(() => {
    if (authLoading || !user) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        setOrder(null);

        if (!orderId) {
          setError("Invalid order ID.");
          return;
        }

        let data = null;
        let docId = orderId;

        if (!db.__isMock) {
          try {
            const docRef = doc(db, "orders", orderId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              data = docSnap.data();
              docId = docSnap.id;
            }
          } catch (dbErr) {
            console.warn("Firestore fetch error, attempting local storage fallback:", dbErr.message);
          }
        }

        // Fallback to local storage if Firestore has not persisted yet
        if (!data) {
          const localOrder = localStorage.getItem(`essmey_order_${orderId}`) ||
            localStorage.getItem(`essmey_mock_order_${orderId}`);
          if (localOrder) {
            try {
              data = JSON.parse(localOrder);
            } catch (e) {
              console.error("Failed to parse local order:", e);
            }
          }
        }

        if (!data) {
          setError("Order not found.");
          return;
        }

        // ── Ownership check: this order must belong to the logged-in user ──────
        if (data.userId && data.userId !== user.uid) {
          setError("Order not found.");
          return;
        }

        const result = {
          ...data,
          _id: docId,
          total: data.totalAmount || data.total || 0,
          placedAt: data.placedAt || data.createdAt || new Date().toISOString(),
        };

        setOrder(result);
        setStatus(calculateDeliveryStatus(result.placedAt));
      } catch (err) {
        setError("Failed to fetch order details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, authLoading, user]);

  if (loading || authLoading) return <LoadingSpinner />;

  if (error)
    return (
      <div className="container-custom max-w-2xl mx-auto p-8">
        <p className="text-red-600 font-semibold">{error}</p>
        <button className="btn-primary mt-4" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );

  if (!order) return null;

  return (
    <div className="container-custom max-w-4xl mx-auto pt-24 pb-16 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Order Summary */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center md:text-left">
            Order Details
          </h1>

          <div className="bg-white border rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">Order ID:</span>
                </div>
                <div className="font-medium text-amber-600">
                  {order.orderId}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">Customer Name:</span>
                </div>
                <div className="font-medium">{order.customerName || "N/A"}</div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">Order Date:</span>
                </div>
                <div className="font-medium">
                  {new Date(
                    order.placedAt
                  ).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">Status:</span>
                </div>
                <div
                  className={`font-medium px-4 py-1 rounded-full ${
                    status === "Order Confirmed"
                      ? "bg-green-100 text-green-800"
                      : status === "In Transit"
                      ? "bg-blue-100 text-blue-800"
                      : status === "Out for Delivery Soon"
                      ? "bg-orange-100 text-orange-800"
                      : status === "Out for Delivery"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {status}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">Total Amount:</span>
                </div>
                <div className="font-medium text-amber-600">
                  ₹{order.total.toFixed(2)}
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const name = item.product?.name || "Premium Fragrance";
                    const price = item.product?.price || 0;
                    const image = item.product?.image || FALLBACK_IMAGE;

                    return (
                      <div
                        key={item._key}
                        className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg shadow-sm"
                      >
                        {image && (
                          <img
                            src={image}
                            alt={name}
                            className="w-20 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-lg">{name}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-neutral-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="font-medium text-amber-600">
                              ₹{(price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn-secondary mt-8 w-full md:w-auto"
            onClick={() => navigate(-1)}
          >
            Back to Orders
          </button>
        </div>

        {/* Right Column - Additional Information */}
        <div className="md:w-1/3">
          <div className="bg-white border rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Order Status Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="flex-1 h-0.5 bg-green-100"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1 h-0.5 bg-blue-100"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <div className="flex-1 h-0.5 bg-orange-100"></div>
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="flex-1 h-0.5 bg-yellow-100"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Delivery Information
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Your order will be delivered within 7-10 business days.
              </p>
              <p className="text-sm text-neutral-600">
                We'll send you tracking updates via email and SMS.
              </p>
              <p className="text-sm text-neutral-600">
                If you have any questions, feel free to contact our customer
                support.
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Customer Support</h2>
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Need help? Contact us at:
              </p>
              <p className="text-sm text-neutral-600">
                Email: support@essmey.com
              </p>
              <p className="text-sm text-neutral-600">Phone: +91 1234567890</p>
              <p className="text-sm text-neutral-600">
                Available: Mon-Fri, 9 AM - 6 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
