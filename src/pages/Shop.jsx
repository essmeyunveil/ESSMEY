import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../features/products/useProducts";
import ProductCard from "../components/ProductCard";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useToastContext } from "../utils/ToastContext";
import { trackError } from "../utils/analytics";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { addToast } = useToastContext();

  const { data: allProducts = [], isLoading: loading, error: queryError } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const error = queryError ? "Failed to load products" : null;

  // Filters state
  const [filters, setFilters] = useState({
    category: categoryParam || "all",
    sort: "featured",
    minPrice: "",
    maxPrice: "",
    isNew: false,
    isBestSeller: false,
  });

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: 'all',
      sort: 'featured',
      minPrice: '',
      maxPrice: '',
      isNew: false,
      isBestSeller: false,
    });
  };

  // Handle filter changes with error handling
  const handleFilterChange = (e) => {
    try {
      const { name, value, type, checked } = e.target;
      
      // Handle checkbox values
      const newValue = type === 'checkbox' ? checked : value;
      
      setFilters(prev => ({
        ...prev,
        [name]: newValue
      }));
    } catch (error) {
      console.error('Error in filter change:', error);
      trackError(error, 'Shop.filtering');
      addToast({
        title: 'Filter Error',
        description: 'An error occurred while applying filters',
        status: 'error'
      });
    }
  };

  // Apply filters and sorting whenever filters change
  useEffect(() => {
    try {
      // Only run filtering if we have products
      if (allProducts.length === 0) return;
      
      let filtered = [...allProducts].filter(product => {
        if (!product) return false;
        
        // Category filter
        if (filters.category !== "all" && product.category !== filters.category) {
          return false;
        }
        
        // Price range filter
        if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
          return false;
        }
        if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
          return false;
        }
        
        // New product filter
        if (filters.isNew && !product.new) {
          return false;
        }
        
        // Best seller filter
        if (filters.isBestSeller && !product.bestSeller) {
          return false;
        }
        
        return true;
      });

      // Apply sorting
      switch (filters.sort) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'featured':
          filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
        case 'newest':
          filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
          break;
        case 'bestselling':
          filtered.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
          break;
        default:
          filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error in filtering/sorting:', error);
      trackError(error, 'Shop.filtering');
      addToast({
        title: 'Filter Error',
        description: 'An error occurred while applying filters',
        status: 'error'
      });
    }
  }, [filters, allProducts]);

  // Update from URL params when component mounts
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  // Render the component
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {usingSampleData && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center">
            <p className="text-yellow-800">
              Using sample product data for demonstration purposes.
            </p>
          </div>
        )}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-center">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={clearFilters}
                className="flex items-center justify-between text-sm mb-6 hover:text-amber"
              >
                Clear all filters
                <XMarkIcon className="w-4 h-4" />
              </button>

              {/* Category Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={filters.category === "all"}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    <span>All Fragrances</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="women"
                      checked={filters.category === "women"}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    <span>Women</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="men"
                      checked={filters.category === "men"}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    <span>Men</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="unisex"
                      checked={filters.category === "unisex"}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    <span>Unisex</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-600">Min</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full border border-neutral-200 rounded px-3 py-2 text-sm"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-600">Max</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full border border-neutral-200 rounded px-3 py-2 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={filters.isNew}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <span>New Arrivals</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={filters.isBestSeller}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <span>Best Sellers</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-neutral-600">
                Showing {filteredProducts.length} products
              </p>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="border border-neutral-200 rounded px-3 py-2 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="bestselling">Best Selling</option>
              </select>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[3/4] bg-neutral-100 rounded"></div>
                    <div className="mt-4">
                      <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                      <div className="h-4 bg-neutral-100 rounded w-1/2 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600">
                  No products found matching your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-amber hover:text-amber-dark"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;