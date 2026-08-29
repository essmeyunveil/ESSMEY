import { useState, useRef, useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { openRazorpay, preloadRazorpay } from "../utils/razorpay";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { generateOrderId } from "../utils/orderId";
import { useAuth } from "../utils/AuthContext";
import { useToastContext } from "../utils/ToastContext";
import CheckoutSkeleton from "../components/CheckoutSkeleton";

const statesIndia = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Puducherry",
];

const Checkout = () => {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const contextError = null;
  const { user, loading: isLoading } = useAuth();
  const { addToast } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Preload Razorpay checkout script so clicking Pay Now launches instantly
    preloadRazorpay();

    if (!isLoading && !user) {
      // Save cart state to localStorage before redirecting
      try {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error saving cart state:", error);
      }
      navigate("/login", {
        state: {
          from: "/checkout",
          message: "Please login to proceed with checkout",
        },
      });
    }
  }, [user, isLoading, navigate, cartItems]);

  const userPrefill = user
    ? {
        name: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      }
    : {};

  const [form, setForm] = useState({
    name: userPrefill.name || "",
    email: userPrefill.email || "",
    phone: userPrefill.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setForm((currentForm) => ({
        ...currentForm,
        name: currentForm.name || user.displayName || "",
        email: currentForm.email || user.email || "",
        phone: currentForm.phone || user.phoneNumber || "",
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState({});

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-28 pb-20 min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-3">Your cart is empty.</h2>
        <button className="btn-primary" onClick={() => navigate("/shop")}>
          Back to Shop
        </button>
      </div>
    );
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "pincode") {
      if (/[^0-9]/.test(value) && value !== "") return;
    }
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = (fields) => {
    let errs = {};
    if (!fields.name || fields.name.length < 2) errs.name = "Enter your name";
    if (!fields.email || !fields.email.includes("@"))
      errs.email = "Enter valid email";
    if (!fields.phone || fields.phone.length < 10)
      errs.phone = "Enter phone (10+ digits)";
    if (!fields.address || fields.address.length < 4)
      errs.address = "Enter full address";
    if (!fields.pincode || fields.pincode.length !== 6)
      errs.pincode = "Enter valid 6 digit pincode";
    if (!fields.city) errs.city = "Enter city";
    if (!fields.state) errs.state = "Select state";
    return errs;
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const customOrderId = generateOrderId();

      if (db.__isMock) {
        // Dev mock checkout fallback
        const mockTransactionId = "pay_mock_" + Math.random().toString(36).substring(2, 11);
        const orderData = {
          orderId: customOrderId,
          totalAmount: cartSubtotal,
          shippingAddress: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
          phoneNumber: form.phone,
          customerName: form.name,
          email: form.email,
          city: form.city,
          state: form.state,
          deliveryStatus: "confirmed",
          paymentMethod: "online",
          paymentStatus: "paid",
          transactionId: mockTransactionId,
          items: cartItems.map((item) => ({
            product: {
              _id: item._id,
              name: item.name,
              price: item.price,
              image: item.thumbnail || (item.images && item.images[0]) || "",
            },
            quantity: item.quantity,
          })),
          placedAt: new Date().toISOString(),
          userId: user.uid,
        };

        localStorage.setItem(
          `essmey_mock_order_${customOrderId}`,
          JSON.stringify(orderData)
        );
        clearCart();
        addToast("Payment successful! Your order has been placed (Mock Mode).", "success");
        setTimeout(() => {
          navigate("/thank-you", { state: { orderId: customOrderId } });
        }, 500);
        return;
      }

      // Sync user profile non-blockingly in background
      if (!db.__isMock && user?.uid) {
        const userDocRef = doc(db, "users", user.uid);
        setDoc(
          userDocRef,
          {
            name: user.displayName || form.name,
            email: user.email || form.email,
            phone: form.phone,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((e) => console.warn("User sync skipped:", e.message));
      }

      const createOrderRecord = async (transactionId = null) => {
        const orderData = {
          orderId: customOrderId,
          totalAmount: cartSubtotal,
          shippingAddress: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
          phoneNumber: form.phone,
          customerName: form.name,
          email: form.email,
          city: form.city,
          state: form.state,
          deliveryStatus: "confirmed",
          paymentMethod: "online",
          paymentStatus: "paid",
          transactionId: transactionId,
          items: cartItems.map((item) => ({
            product: {
              _id: item._id,
              name: item.name,
              price: item.price,
              image: item.thumbnail || (item.images && item.images[0]) || "",
            },
            quantity: item.quantity,
          })),
          placedAt: new Date().toISOString(),
          userId: user.uid,
        };

        try {
          if (!db.__isMock) {
            await setDoc(doc(db, "orders", customOrderId), orderData);
          }
        } catch (firestoreErr) {
          console.warn("Firestore order sync failed, saving to local backup:", firestoreErr.message);
        }

        // Save local backup so order details & thank-you page always resolve
        localStorage.setItem(`essmey_order_${customOrderId}`, JSON.stringify(orderData));

        clearCart();
        addToast("Payment successful! Your order has been placed.", "success");

        setTimeout(() => {
          navigate("/thank-you", { state: { orderId: customOrderId } });
        }, 500);
      };

      // Request secure Order ID from API with quick timeout
      let orderData = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const orderResponse = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            amount: cartSubtotal,
            currency: "INR",
            receipt: customOrderId,
          }),
        });
        clearTimeout(timeoutId);
        if (orderResponse.ok) {
          orderData = await orderResponse.json();
        }
      } catch (err) {
        console.warn("Server order generation skipped/timed out, using direct checkout:", err.message);
      }

      const razorpayOptions = {
        amount: orderData?.amount || Math.round(cartSubtotal * 100),
        currency: orderData?.currency || "INR",
        name: "Essmey Perfume",
        description: "Payment for your order",
        orderId: orderData?.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#c08c53",
        },
      };

      const payment = await openRazorpay(razorpayOptions);
      try {
        await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payment),
        });
      } catch (verifyErr) {
        console.warn("Payment verification recording warning:", verifyErr.message);
      }

      await createOrderRecord(payment.razorpay_payment_id);
    } catch (error) {
      console.error("Order error:", error);
      setError(error.message || "Something went wrong. Please try again.");
      addToast(error.message || "Order placement failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-[70vh]">
      <div className="container-custom grid gap-12 md:grid-cols-3">
        <form
          ref={formRef}
          className="md:col-span-2 bg-white border rounded-lg shadow p-8"
          onSubmit={handleOrder}
        >
          <h1 className="text-2xl font-serif font-bold mb-4">
            Secure Checkout | Shipping Details
          </h1>
          {(error || contextError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error || contextError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="font-medium">Name*</label>
              <input
                name="name"
                value={form.name}
                onChange={handleInput}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={loading}
              />
              {errors.name && (
                <div className="text-red-500 text-xs mt-1">{errors.name}</div>
              )}
            </div>
            <div>
              <label className="font-medium">Email*</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleInput}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={loading}
              />
              {errors.email && (
                <div className="text-red-500 text-xs mt-1">{errors.email}</div>
              )}
            </div>
            <div>
              <label className="font-medium">Phone*</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleInput}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={loading}
              />
              {errors.phone && (
                <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
              )}
            </div>
            <div>
              <label className="font-medium">Pincode*</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleInput}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={loading}
              />
              {errors.pincode && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.pincode}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Address*</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleInput}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={loading}
              />
              {errors.address && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.address}
                </div>
              )}
            </div>
            <div>
              <label className="font-medium">City*</label>
              <input
                name="city"
                value={form.city}
                onChange={handleInput}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={loading}
              />
              {errors.city && (
                <div className="text-red-500 text-xs mt-1">{errors.city}</div>
              )}
            </div>
            <div>
              <label className="font-medium">State*</label>
              <select
                name="state"
                value={form.state}
                onChange={handleInput}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={loading}
              >
                <option value="">Select State</option>
                {statesIndia.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <div className="text-red-500 text-xs mt-1">{errors.state}</div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Notes (Optional)</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleInput}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>
        <div className="bg-white border rounded-lg shadow p-8 h-fit">
          <h2 className="text-xl font-serif font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{cartSubtotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
