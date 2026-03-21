import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";
import { XMarkIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { urlFor } from "../utils/sanity";

const Wishlist = () => {
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleImageError = (event) => {
    event.target.src = "https://via.placeholder.com/300x400?text=No+Image";
    event.target.onerror = null;
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Empty State / Products */}
          <div className="md:w-2/3">
            {wishlistItems.length === 0 ? (
              <div className="bg-white border rounded-lg shadow-lg p-8 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBagIcon className="h-12 w-12 text-amber-600" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold mb-4">Your Wishlist is Empty</h2>
                  <p className="text-neutral-600 mb-6">
                    Start adding your favorite perfumes to your wishlist to keep track of them.
                  </p>
                  <Link to="/shop" className="btn-primary">
                    Start Exploring
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {wishlistItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full"
                  >
                    <div className="relative">
                      <div className="relative">
                        <Link to={`/product/${item._id}`} className="block">
                          <img
                            src={
                              item.images?.[0]?.asset?._ref
                                ? urlFor(item.images[0])
                                : "https://via.placeholder.com/300x400?text=No+Image"
                            }
                            alt={item.name}
                            className="w-full h-64 object-cover"
                            onError={handleImageError}
                            loading="lazy"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromWishlist(item._id);
                            }}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-100 transition-colors z-10"
                            title="Remove from wishlist"
                          >
                            <XMarkIcon className="h-5 w-5 text-red-600" />
                          </button>
                        </Link>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          <Link to={`/product/${item._id}`} className="block">
                            <h3 className="font-medium text-lg mb-2 hover:text-amber-600 transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-neutral-600 mb-4">
                              {item.description}
                            </p>
                          </Link>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold">
                              ₹{item.price?.toFixed(2)}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addToCart(item)}
                                className={`flex-1 btn-primary flex items-center justify-center gap-2 ${
                                  !item.stock || item.stock < 1 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={!item.stock || item.stock < 1}
                                title={item.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                              >
                                <ShoppingBagIcon className="h-5 w-5" />
                                {item.stock < 1 ? "Out of Stock" : "Add to Cart"}
                              </button>
                            
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Additional Information */}
          <div className="md:w-1/3">
            <div className="bg-white border rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">About Your Wishlist</h2>
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Your wishlist helps you keep track of your favorite perfumes. You can easily add
                  items to your cart or remove them whenever you want.
                </p>
                <p className="text-sm text-neutral-600">
                  When items are out of stock, they'll be marked as such in your wishlist.
                </p>
                <p className="text-sm text-neutral-600">
                  You can also share your wishlist with friends and family using the share button.
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Quick Tips</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600">1</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Add items to your wishlist while browsing the shop.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600">2</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Items in your wishlist won't be reserved - they're just for your reference.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600">3</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    You can easily move items from wishlist to cart when you're ready to purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Wishlist.displayName = 'Wishlist';
export default Wishlist;
