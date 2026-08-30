import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBagIcon,
  HeartIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { getImageUrl } from "../utils/sanity";
import { trackError } from "../utils/analytics";

const FALLBACK_IMAGE = "/images/product-1.jpg";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const contextError = null;

  if (!product || !product._id) {
    trackError(
      new Error("Invalid product data provided to ProductCard"),
      "ProductCard"
    );
    return null;
  }

  const productId = product._id;

  const handleAddToCart = () => {
    try {
      addToCart(product, 1);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 1500);
    } catch (error) {
      trackError(error, "ProductCard.addToCart");
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
        // console.log("Removed from wishlist");
      } else {
        addToWishlist(product);
        // console.log("Added to wishlist");
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };

  const mainImage =
    (product.images && product.images.length > 0 && getImageUrl(product.images[0])) ||
    product.image ||
    product.thumbnail ||
    FALLBACK_IMAGE;
  const saving = Number(product.mrp) > Number(product.price)
    ? Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)
    : 0;

  const handleImageError = (e) => {
    console.error("Error loading product image:", e);
    setImageError(true);
    // Try to load the fallback image
    e.target.src = FALLBACK_IMAGE;
    // Also try to load the original image again in case it was a temporary issue
    setTimeout(() => {
      if (product.images && product.images.length > 0) {
        const imageUrl = getImageUrl(product.images[0]);
        if (imageUrl) {
          e.target.src = imageUrl;
        }
      }
    }, 1000);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Preload the image
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const imageUrl = getImageUrl(product.images[0]);
      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;
        img.onload = handleImageLoad;
        img.onerror = handleImageError;
      }
    }
  }, [product.images]);

  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price || 0);
    } catch (error) {
      console.error("Error formatting price:", error);
      return `₹${(price || 0).toFixed(2)}`;
    }
  };

  const lowestPrice =
    product.sizeVariants && product.sizeVariants.length > 0
      ? Math.min(...product.sizeVariants.map((v) => Number(v.price) || product.price))
      : product.price;
  const isMultiSized = (product.sizeVariants && product.sizeVariants.length > 1) || (product.sizes && product.sizes.length > 1);

  return (
    <div
      className="product-card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${productId}`} className="block h-full">
        <div className="relative overflow-hidden group">
          <div className="aspect-[3/4] bg-neutral-100 overflow-hidden relative">
            <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-2">
              {product.new && <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-900 shadow-sm">New arrival</span>}
              {product.bestSeller && <span className="rounded-full bg-[#2b1d12] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-white shadow-sm">Bestseller</span>}
            </div>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse bg-neutral-200 w-full h-full"></div>
              </div>
            )}
            <img
              src={mainImage}
              alt={`${product.name} - Handcrafted Premium Perfume by Essmey`}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlistClick(e);
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-colors"
              aria-label={
                isInWishlist(productId)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
              }
            >
              {isInWishlist(productId) ? (
                <HeartSolidIcon className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6 text-black" />
              )}
            </button>
            <div
              className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white px-4 py-3 flex justify-between items-center transition-transform duration-300 ${
                isHovered ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <span className="text-sm">Quick Add</span>
              {isAddedToCart ? (
                <CheckIcon className="h-5 w-5 text-green-500" />
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                  aria-label="Add to Cart"
                  disabled={!product.stock || product.stock < 1}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          <div className="p-5 bg-white">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-700 mb-2">{product.brand || "Essmey"}{product.volume ? ` · ${product.volume}` : ""}</p>
            <h3 className="text-lg font-serif font-medium text-neutral-900">
              {product.name || "Unnamed Product"}
            </h3>
            <div className="flex justify-between items-end gap-3 mt-3">
              <span className="text-neutral-900 font-semibold">
                {isMultiSized && <span className="text-xs font-normal text-stone-500 mr-1">From</span>}
                {formatPrice(lowestPrice)}
                {product.mrp && Number(product.mrp) > Number(lowestPrice) && <span className="ml-2 text-xs font-normal text-neutral-400 line-through">{formatPrice(product.mrp)}</span>}
              </span>
              {saving > 0 ? <span className="text-xs font-semibold text-emerald-700">Save {saving}%</span> : product.category && <span className="text-xs text-neutral-500 uppercase">{product.category}</span>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
