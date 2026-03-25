import { useProducts } from "../features/products/useProducts";
import ProductCard from "./ProductCard";

const AILovedSuggestions = ({ currentProduct }) => {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading || !currentProduct || products.length === 0) return null;

  // The AI Recommendation Algorithm
  const currentTopNotes = currentProduct.notes?.top || [];
  
  const recommendations = products.filter(p => {
    // 1. Don't recommend the exact same product
    if (p._id === currentProduct._id) return false;
    
    let score = 0;
    // 2. Base category matching
    if (p.category === currentProduct.category) score += 2;
    
    // 3. Scent profile matching algorithm
    const pTopNotes = p.notes?.top || [];
    const sharedNotes = pTopNotes.filter(note => currentTopNotes.includes(note));
    score += sharedNotes.length * 3; // Identical notes match are heavily weighted
    
    p.compatibilityScore = score;
    return score > 0;
  });

  // Sort by highest compatibility score, render top 4
  const topRecommendations = recommendations
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore || 0.5 - Math.random())
    .slice(0, 4);

  if (topRecommendations.length === 0) return null;

  return (
    <div className="mt-20 border-t border-neutral-200 pt-16">
      <div className="flex justify-between items-end mb-10">
         <div>
            <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-2">People Also Loved</h2>
            <p className="text-neutral-500">Based on the scent profile of {currentProduct.name}</p>
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topRecommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AILovedSuggestions;
