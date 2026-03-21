import { useSearchParams, Link } from "react-router-dom";
import { useAppContext } from "../utils/context";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const { handleSearch, searchResults } = useAppContext();
  const [input, setInput] = useState(query);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    if (query) {
      setInput(query);
      handleSearch(query);
    }
  }, [query]);

  useEffect(() => {
    setShowNoResults(!!query && searchResults.length === 0);
  }, [searchResults, query]);

  function onSubmit(e) {
    e.preventDefault();
    if (input.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(input)}`;
    }
  }

  return (
    <div className="pt-24 pb-16 min-h-[60vh]">
      <div className="container-custom">
        <h1 className="text-3xl font-serif font-bold mb-8">Search Results</h1>
        <form onSubmit={onSubmit} className="mb-8 flex gap-3 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border rounded px-4 py-3"
            placeholder="Search for perfumes..."
            autoFocus
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {query && (
          <div className="mb-8 text-lg font-medium">
            {searchResults.length} results for{" "}
            <span className="italic">“{query}”</span>
          </div>
        )}
        {showNoResults && (
          <div className="text-center text-neutral-500 mt-8">
            <div className="mb-2 text-xl">No products found for “{query}”</div>
            <Link to="/shop" className="btn-secondary mt-4">
              Go to Shop
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
