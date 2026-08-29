import { useAuth } from "../utils/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) {
        setOrders([]);
        return;
      }
      setLoading(true);
      try {
        if (db.__isMock) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("placedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const items = (data.items || []).map((item) => {
            const product = item.product || {};
            return {
              _key: item._key || Math.random().toString(36).substr(2, 9),
              name: product.name || item.name || "",
              price: product.price || item.price || 0,
              quantity: item.quantity || 1,
              image: product.image || item.image || null,
            };
          });

          fetchedOrders.push({
            _id: doc.id,
            orderId: data.orderId,
            placedAt: data.placedAt || data.createdAt,
            total: data.totalAmount || data.total,
            deliveryStatus: data.deliveryStatus,
            items: items,
          });
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-28 pb-20 min-h-[60vh] container-custom max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-serif font-medium text-stone-900 mb-6">My Account</h1>
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-8 mb-10">
        <div className="flex items-center gap-4 mb-6">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-600/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-serif text-2xl font-bold">
              {user.displayName?.charAt(0)?.toUpperCase() || "E"}
            </div>
          )}
          <div>
            <h2 className="text-xl font-serif font-medium text-stone-900">{user.displayName}</h2>
            <p className="text-sm text-stone-500">{user.email}</p>
          </div>
        </div>

        <button
          className="btn-secondary text-sm px-6 py-2.5 rounded-lg"
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          Sign Out
        </button>
      </div>

      <h2 className="text-2xl font-serif font-semibold mb-5">Order History</h2>
      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div className="text-neutral-400">You have no orders yet.</div>
      ) : (
        <div className="space-y-6">
          {orders
            .filter((order) => order.orderId)
            .map((order) => (
              <div
                key={order._id}
                className="border rounded p-4 bg-white cursor-pointer hover:shadow-md transition"
                onClick={() => navigate(`/order/${order.orderId}`)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-blue-700 text-sm">
                    Order ID: {order.orderId}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(order.placedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-1">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-green-600 font-semibold">
                    {order.deliveryStatus}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="font-medium">Total:</span> ₹
                  {(order.total ?? 0).toFixed(2)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <div
                      key={item._key}
                      className="flex items-center gap-2 border rounded px-2 py-1 bg-neutral-50"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-neutral-400">
                          x{item.quantity} &times; ₹{item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
