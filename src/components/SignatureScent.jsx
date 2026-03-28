import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useProducts } from "../features/products/useProducts";
import ProductCard from "./ProductCard";
import { getImageUrl } from "../utils/sanity";

const SignatureScent = () => {
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: products = [], isLoading } = useProducts();

  if (isLoading || products.length === 0) return null;

  // AI Logic: Determine favorite category based on cart + wishlist
  const preferences = {};
  [...cartItems, ...wishlistItems].forEach(item => {
    if (item.category) {
      preferences[item.category] = (preferences[item.category] || 0) + 1;
    }
  });

  const hasPreferences = Object.keys(preferences).length > 0;
  
  let recommendedProduct = null;

  if (hasPreferences) {
    // Find the highest scored category
    const favoriteCategory = Object.keys(preferences).reduce((a, b) => preferences[a] > preferences[b] ? a : b);
    
    // Find highest rated or best-selling product in that category not already in cart
    const cartIds = cartItems.map(i => i._id);
    const categoryProducts = products.filter(p => p.category === favoriteCategory && !cartIds.includes(p._id));
    
    if (categoryProducts.length > 0) {
      // Prioritize bestsellers first, fallback to first available
      recommendedProduct = categoryProducts.sort((a,b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0))[0];
    }
  }

  return (
    <section className="py-20 bg-[#1a1208] text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-medium mb-3 text-amber uppercase tracking-[0.2em]">AI Intelligence</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6">Your Signature Scent</h3>
            
            {hasPreferences && recommendedProduct ? (
              <>
                <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
                  Based on your recent interest in <strong className="text-amber capitalize">{recommendedProduct.category}</strong> fragrances, our scent engine has surfaced a masterpiece tailored perfectly to your unique profile.
                </p>
                <div className="max-w-sm bg-white rounded-xl overflow-hidden shadow-2xl p-1">
                   <ProductCard product={recommendedProduct} />
                </div>
              </>
            ) : (
              <>
                <p className="text-neutral-400 text-lg mb-10 leading-relaxed max-w-lg">
                  Let our intelligent scent engine discover the perfect fragrance that resonates with your unique personality, lifestyle, and physical aura. 
                </p>
                <Link to="/scent-finder" className="inline-flex items-center justify-center border-2 border-amber text-amber px-10 py-4 font-medium tracking-wide hover:bg-amber hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                  Launch the Engine
                </Link>
              </>
            )}
          </div>
          
          <div className="hidden lg:block relative h-[550px] w-full rounded-2xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-60"></div>
            <img 
              src={recommendedProduct && recommendedProduct.images?.[0] ? getImageUrl(recommendedProduct.images[0]) : "/images/tusu.jpg"} 
              alt="Signature Scent" 
              className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
            />
            {recommendedProduct && (
               <div className="absolute bottom-10 left-10 z-20">
                  <p className="text-amber uppercase tracking-widest text-xs font-semibold mb-2">98% Match</p>
                  <p className="text-3xl font-serif text-white">{recommendedProduct.name}</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureScent;
