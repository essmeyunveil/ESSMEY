import { useAuth } from "../utils/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "../utils/sanity";
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
        const query = `*[_type == "order" && userId == $userId] | order(placedAt desc) {
          _id,
          orderId,
          deliveryStatus,
          total,
          placedAt,
          items[]{
            _key,
            name,
            price,
            quantity,
            "image": asset->url
          }
        }`;
        const params = { userId: user.uid };
        const fetchedOrders = await client.fetch(query, params);
        // console.log("Fetched orders:", fetchedOrders);
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
    <div className="pt-28 pb-20 min-h-[60vh] container-custom max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif font-bold mb-6">My Account</h1>
      <div className="bg-white border rounded-lg shadow p-8 mb-10">
        <div className="mb-2">
          <span className="font-medium">Email:</span> {user.email}
        </div>
        <button
          className="btn-secondary mt-6"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Log Out
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
