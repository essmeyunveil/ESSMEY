import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAppContext } from "../utils/context";

const SearchModal = () => {
  const { handleSearch, searchResults } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Listen for custom event to toggle modal
  useEffect(() => {
    const toggleSearchHandler = (e) => {
      setIsOpen(e.detail.open);
    };

    window.addEventListener("toggleSearchModal", toggleSearchHandler);

    return () => {
      window.removeEventListener("toggleSearchModal", toggleSearchHandler);
    };
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle key press to close modal with ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setQuery("");
    handleSearch("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center">
      <div
        ref={searchRef}
        className="bg-white w-full max-w-3xl mt-24 max-h-[70vh] overflow-y-auto rounded shadow-xl"
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif">Search Products</h2>
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-neutral-100"
              aria-label="Close search"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center border border-neutral-300"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={handleInputChange}
              className="flex-grow p-3 outline-none"
            />
            <button
              type="submit"
              className="p-3 bg-black text-white"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
        </div>

        {query && (
          <div className="p-4">
            <p className="text-sm text-neutral-500 mb-4">
              {Array.isArray(searchResults) ? searchResults.length : 0} results
              for "{query}"
            </p>

            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.slice(0, 4).map((product) => (
                  <div
                    key={`search-result-${product._id}`}
                    className="flex items-center p-2 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      closeModal();
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-neutral-500">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products found matching your search.</p>
            )}

            {Array.isArray(searchResults) && searchResults.length > 4 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                    closeModal();
                  }}
                  className="text-sm text-black underline"
                >
                  View all {searchResults.length} results
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
