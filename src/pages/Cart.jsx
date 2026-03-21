import { useCartStore } from "../store/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingBagIcon, SparklesIcon, ArrowTrendingUpIcon, TagIcon } from "@heroicons/react/24/outline";
             
const FALLBACK_IMAGE = "/images/product-1.jpg";

const Cart = () => {
  const cartItems = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateCartQuantity = useCartStore((state) => state.updateCartQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-16 min-h-[50vh]">
      <div className="container-custom">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Cart</h1>
        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center mt-16 space-y-12">
            <div className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center">
                  <ShoppingBagIcon className="h-16 w-16 text-neutral-300" />
                </div>
                <h2 className="text-3xl font-serif font-semibold text-neutral-600">
                  Your Cart is Empty
                </h2>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Your shopping cart is currently empty. Start adding some items to
                  your cart and make your shopping experience more enjoyable.
                </p>
              </div>

              <div className="space-y-6">
                <Link to="/shop" className="btn-primary w-48 mx-auto">
                  <span>Start Shopping</span>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {/* Best Sellers Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-neutral-600">Best Sellers</h3>
                      <SparklesIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-neutral-500">Discover our most loved fragrances</p>
                      <Link to="/shop?category=best-sellers" className="text-sm text-amber-500 hover:text-amber-600">
                        View Collection
                      </Link>
                    </div>
                  </div>

                  {/* New Arrivals Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-neutral-600">New Arrivals</h3>
                      <ArrowTrendingUpIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-neutral-500">Fresh scents just arrived</p>
                      <Link to="/shop?new=true" className="text-sm text-amber-500 hover:text-amber-600">
                        Explore Now
                      </Link>
                    </div>
                  </div>

                  {/* Sale Items Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-neutral-600">Special Offers</h3>
                      <TagIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-neutral-500">Limited time deals</p>
                      <Link to="/shop?price=discounted" className="text-sm text-amber-500 hover:text-amber-600">
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart items table */}
            <div className="flex-1">
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full bg-white">
                  <thead>
                    <tr className="text-sm font-semibold uppercase border-b">
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Quantity</th>
                      <th className="p-3 text-left">Total</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      // Get the image URL from the item
                      const imageUrl =
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : FALLBACK_IMAGE;

                      return (
                        <tr
                          className="border-b group"
                          key={`${item._id}-${item.selectedSize || ""}`}
                        >
                          <td className="p-3 flex items-center gap-4">
                            <Link
                              to={`/product/${item._id}`}
                              className="block hover:opacity-90"
                            >
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-16 h-20 object-cover rounded border"
                                onError={(e) => {
                                  e.target.src = FALLBACK_IMAGE;
                                }}
                              />
                            </Link>
                            <div>
                              <Link
                                to={`/product/${item._id}`}
                                className="font-medium hover:underline"
                              >
                                {item.name}
                              </Link>
                              {item.selectedSize && (
                                <div className="text-xs text-neutral-400">
                                  Size: {item.selectedSize}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-neutral-600">
                            ₹{(item.price || 0).toFixed(2)}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateCartQuantity(item._id, Math.max(1, item.quantity - 1), item.selectedSize)}
                                className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-neutral-100"
                              >
                                <span className="text-lg">-</span>
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateCartQuantity(item._id, Math.max(1, parseInt(e.target.value) || 1), item.selectedSize)}
                                min="1"
                                className="w-20 h-10 px-3 border rounded-md text-center"
                              />
                              <button
                                onClick={() => updateCartQuantity(item._id, Math.min(item.stock || 100, item.quantity + 1), item.selectedSize)}
                                className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-neutral-100"
                              >
                                <span className="text-lg">+</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-3 font-semibold">
                            ₹{((item.price || 0) * item.quantity).toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              className="p-1 text-neutral-400 hover:bg-neutral-100 rounded-full"
                              title="Remove"
                              onClick={() =>
                                removeFromCart(item._id, item.selectedSize)
                              }
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-6">
                <button className="btn-secondary" onClick={clearCart}>
                  Clear Cart
                </button>
                <Link to="/shop" className="text-sm underline hover:text-black">
                  Continue Shopping
                </Link>
              </div>
            </div>
            {/* Cart Summary */}
            <div className="w-full max-w-sm mx-auto border rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-serif mb-6 font-semibold">
                Order Summary
              </h2>
              <div className="flex justify-between mb-1">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-neutral-500 text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <button
                className="btn-primary w-full mb-2"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
              <span className="block text-center text-xs text-neutral-500 mt-1">
                No payment is required (demo app)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
