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
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        if (db.__isMock) {
          throw new Error("Firebase is running in local MOCK mode.");
        }

        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("Product not found");
        }

        const data = docSnap.data();
        const productResult = {
          _id: docSnap.id,
          ...data,
          image: data.thumbnail || (data.images && data.images[0]) || "",
        };

        if (!productResult) {
          const localProduct = localProducts.find(
            (item) => String(item.id) === String(id) || `local-${item.id}` === id
          );

          if (localProduct) {
            setProduct({
              _id: `local-${localProduct.id}`,
              name: localProduct.name,
              price: localProduct.price,
              stock: localProduct.stock,
              description: localProduct.description,
              image: localProduct.image,
              images: localProduct.images,
              category: localProduct.category,
              notes: localProduct.notes,
            });
            return;
          }

          throw new Error("Product not found");
        }

        setProduct(productResult);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.message || "Failed to load product data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      addToCart(product, quantity);
      if (shouldNavigate) {
        navigate("/checkout");
      }
      // console.log(`${product.name} added to cart!`);
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
        // console.log("Shared successfully");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        // addToast("Link copied to clipboard");
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
                className="w-full h-[500px] object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
              {product.new && <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase shadow-sm">New arrival</span>}
            </div>
            {productImages.length > 1 && <div className="flex gap-3 mt-4 overflow-x-auto">{productImages.map((image, index) => <button type="button" key={image} onClick={() => setActiveImage(index)} className={`h-20 w-16 shrink-0 overflow-hidden rounded-md border-2 ${activeImage === index ? "border-amber-700" : "border-transparent"}`}><img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" /></button>)}</div>}
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
              <p className="text-sm text-neutral-500 mb-6">{product.volume || "50 ml"} · In stock: {product.stock ?? 0}</p>

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
