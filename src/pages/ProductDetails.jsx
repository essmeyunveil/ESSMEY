import { useParams, Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useState, useEffect } from "react";
import {
  ShoppingBagIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import ProductReviews from "../components/ProductReviews";
import AnimatedScentProfile from "../components/AnimatedScentProfile";
import ProductSkeleton from "../components/ProductSkeleton";
import { products as localProducts } from "../utils/sampleData";

const FALLBACK_IMAGE = "/images/product-1.jpg";

const ProductDetails = () => {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const contextError = null;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const resolveProduct = async () => {
      setError(null);

      // 1. Instant Cache Resolution (0ms delay)
      let found = null;

      // Check localStorage first
      try {
        const localSaved = localStorage.getItem("essmey_mock_products_v2");
        if (localSaved) {
          const list = JSON.parse(localSaved);
          found = list.find(
            (p) =>
              String(p._id) === String(id) ||
              String(p.id) === String(id) ||
              p.slug === id
          );
        }
      } catch (e) {
        console.warn("Could not read local products storage:", e);
      }

      // Check sampleData fallback
      if (!found && localProducts) {
        const sample = localProducts.find(
          (p) =>
            String(p.id) === String(id) ||
            `local-${p.id}` === String(id) ||
            p.slug === id
        );
        if (sample) {
          found = {
            _id: `local-${sample.id}`,
            name: sample.name,
            price: sample.price,
            stock: sample.stock || 10,
            description: sample.description,
            image: sample.image || FALLBACK_IMAGE,
            images: sample.images || [sample.image || FALLBACK_IMAGE],
            category: sample.category || "unisex",
            notes: sample.notes || {
              top: ["Bergamot"],
              middle: ["Jasmine"],
              base: ["Amber"],
            },
          };
        }
      }

      // If found in local cache, show instantly!
      if (found && isMounted) {
        setProduct(found);
        setLoading(false);
      }

      // 2. Background Firestore Sync (with 2-second timeout)
      if (!db.__isMock) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 2000)
          );
          const fetchPromise = getDoc(doc(db, "products", id));
          const docSnap = await Promise.race([fetchPromise, timeoutPromise]);

          if (docSnap && docSnap.exists && docSnap.exists() && isMounted) {
            const data = docSnap.data();
            const remoteProduct = {
              _id: docSnap.id,
              ...data,
              image: data.thumbnail || (data.images && data.images[0]) || FALLBACK_IMAGE,
              images: data.images?.length ? data.images : [data.thumbnail || FALLBACK_IMAGE],
            };
            setProduct(remoteProduct);
            setLoading(false);
            return;
          }
        } catch (remoteErr) {
          console.warn("Firestore product sync skipped (offline/cached mode):", remoteErr.message);
        }
      }

      if (!found && isMounted) {
        setLoading(false);
        setError("Product not found. It may have been moved or removed.");
      }
    };

    resolveProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const availableSizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ["2 ml", "5 ml", "50 ml", "100 ml"];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "50 ml");

  useEffect(() => {
    if (product.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleWishlistClick = (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();

      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
        // console.log("Removed from wishlist");
      } else {
        addToWishlist(product);
        // console.log("Added to wishlist");
      }
    } catch (err) {
      console.error("Error handling wishlist:", err);
    }
  };

  const handleAddToCart = (shouldNavigate = false) => {
    if (product.stock === 0) {
      console.error("Product is out of stock");
      return;
    }
    if (quantity > product.stock) {
      console.error(`Only ${product.stock} items available`);
      return;
    }
    try {
      addToCart(product, quantity, selectedSize);
      if (shouldNavigate) {
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    } else {
      alert("Sharing not supported on this browser");
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {error || "Product Not Found"}
        </h1>
        <Link to="/shop" className="btn-primary mt-4">
          Back to Shop
        </Link>
      </div>
    );
  }

  const productImages = product.images?.length ? product.images : [product.image || FALLBACK_IMAGE];
  const saving = Number(product.mrp) > Number(product.price)
    ? Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)
    : 0;

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {contextError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {contextError}
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Images */}
          <div className="flex-1">
            <div className="relative">
              <img
                src={productImages[activeImage] || FALLBACK_IMAGE}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
              {product.new && <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase shadow-sm">New arrival</span>}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    type="button"
                    key={image + index}
                    onClick={() => setActiveImage(index)}
                    className={`h-20 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      activeImage === index ? "border-amber-700 shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-amber-700 mb-3">{product.brand || "Essmey"}{product.concentration ? ` · ${product.concentration}` : ""}</p>
              <h1 className="text-3xl font-serif font-bold mb-3">
                {product.name}
              </h1>
              <p className="text-2xl text-neutral-900 font-semibold mb-2">
                ₹{product.price?.toFixed(2)} {product.mrp && Number(product.mrp) > Number(product.price) && <><span className="ml-2 text-base font-normal text-neutral-400 line-through">₹{Number(product.mrp).toFixed(2)}</span>{saving > 0 && <span className="ml-2 text-sm font-semibold text-emerald-700">Save {saving}%</span>}</>}
              </p>
              <p className="text-sm text-neutral-500 mb-6">{selectedSize} · In stock: {product.stock ?? 0}</p>

              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={handleWishlistClick}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  {isInWishlist(product._id) ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-black" />
                  )}
                </button>
                <button
                  onClick={handleShareClick}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <ShareIcon className="h-6 w-6 text-black" />
                </button>
              </div>

              {/* Volume / Size Selector */}
              {availableSizes && availableSizes.length > 0 && (
                <div className="mb-6 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                      Choose Size / Volume:
                    </span>
                    <span className="text-xs text-amber-800 font-medium bg-amber-100/60 px-2 py-0.5 rounded">
                      Selected: {selectedSize}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                          selectedSize === size
                            ? "bg-stone-900 text-amber-100 border-stone-900 shadow-sm"
                            : "bg-white text-stone-700 border-stone-300 hover:border-stone-400 hover:bg-stone-100/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-500">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-neutral-100"
                    >
                      <span className="text-lg">-</span>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(
                              product.stock || 100,
                              parseInt(e.target.value) || 1
                            )
                          )
                        )
                      }
                      max={product.stock || 100}
                      className="w-20 h-10 px-3 border rounded-md text-center"
                    />
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(product.stock || 100, quantity + 1)
                        )
                      }
                      className="w-8 h-8 rounded-md border flex items-center justify-center hover:bg-neutral-100"
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="w-full border-2 border-black text-black font-medium py-4 rounded-md hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                    disabled={product.stock === 0 || quantity > product.stock}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleAddToCart(true)}
                    className="w-full bg-black text-white font-medium py-4 rounded-md hover:bg-neutral-800 transition-all duration-300 shadow-lg"
                    disabled={product.stock === 0 || quantity > product.stock}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Buy It Now"}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-neutral-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Animated Perfume Notes Section */}
                <AnimatedScentProfile notes={product.notes} />
              </div>
            </div>
          </div>
        </div>

        {/* Render Product Reviews */}
        <ProductReviews productId={product._id} />

      </div>
    </div>
  );
};

export default ProductDetails;
