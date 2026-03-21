import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBagIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../utils/AuthContext";
import { useCartStore } from "../store/useCartStore";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearchModal = () => {
    setShowSearchModal(!showSearchModal);
    if (!showSearchModal) {
      window.dispatchEvent(
        new CustomEvent("toggleSearchModal", { detail: { open: true } })
      );
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container-custom grid grid-cols-3 items-center gap-4">
        {/* Left: Mobile Menu Toggle & Desktop Navigation */}
        <div className="flex items-center justify-start">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-amber/10 transition-colors"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-black hover:text-amber transition-colors" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-black hover:text-amber transition-colors" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link hover:text-amber transition-colors">
              Home
            </Link>
            <Link to="/shop" className="nav-link hover:text-amber transition-colors">
              Shop
            </Link>
            <div className="relative group">
              <button className="nav-link flex items-center hover:text-amber transition-colors">
                Collections
                <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-amber/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-1">
                  <Link to="/shop?category=men" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber/10 hover:text-amber">Men</Link>
                  <Link to="/shop?category=women" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber/10 hover:text-amber">Women</Link>
                  <Link to="/shop?category=unisex" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber/10 hover:text-amber">Unisex</Link>
                </div>
              </div>
            </div>
            <Link to="/about" className="nav-link hover:text-amber transition-colors">
              About
            </Link>
            <Link to="/contact" className="nav-link hover:text-amber transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Center: Logo */}
        <div className="flex items-center justify-center">
          <Link to="/" className="text-3xl md:text-4xl font-serif tracking-widest font-bold">
            <span className="text-amber">ESSMEY</span>
          </Link>
        </div>

        {/* Right: Icons & Extra Links */}
        <div className="flex items-center justify-end space-x-3 md:space-x-4">
          <Link
            to="/scent-finder"
            className="hidden lg:inline-flex essmey-learnmore-btn !px-4 !py-2 !text-xs !bg-amber border-none text-white hover:!bg-black hover:!text-white mr-2"
          >
            Find Your Scent
          </Link>
          <button
            className="p-1 rounded-full hover:bg-amber/10 transition-colors"
            onClick={toggleSearchModal}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-black hover:text-amber transition-colors" />
          </button>
          <Link to="/wishlist" className="p-1 rounded-full hover:bg-amber/10 transition-colors hidden sm:block">
            <HeartIcon className="h-5 w-5 text-black hover:text-amber transition-colors" />
          </Link>
          <Link to={isAuthenticated ? "/account" : "/login"} className="p-1 rounded-full hover:bg-amber/10 transition-colors hidden sm:block">
            <UserIcon className="h-5 w-5 text-black hover:text-amber transition-colors" />
          </Link>
          <Link to="/cart" className="relative p-1 rounded-full hover:bg-amber/10 transition-colors">
            <ShoppingBagIcon className="h-5 w-5 text-black hover:text-amber transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-xs bg-amber text-white rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md">
          <nav className="container-custom py-4 flex flex-col space-y-3">
            <Link
              to="/"
              className="nav-link py-2 hover:text-amber transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="nav-link py-2 hover:text-amber transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <details className="group">
              <summary className="nav-link py-2 list-none flex justify-between cursor-pointer hover:text-amber transition-colors">
                Collections
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="mt-2 ml-4 space-y-2">
                <Link
                  to="/shop?category=men"
                  className="block nav-link py-2 hover:text-amber transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Men
                </Link>
                <Link
                  to="/shop?category=women"
                  className="block nav-link py-2 hover:text-amber transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Women
                </Link>
                <Link
                  to="/shop?category=unisex"
                  className="block nav-link py-2 hover:text-amber transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Unisex
                </Link>
              </div>
            </details>
            <Link
              to="/about"
              className="nav-link py-2 hover:text-amber transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="nav-link py-2 hover:text-amber transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/wishlist"
              className="nav-link py-2 hover:text-amber transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Wishlist
            </Link>
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="nav-link py-2 hover:text-amber transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {isAuthenticated ? "My Account" : "Login / Register"}
            </Link>

            <Link
              to="/scent-finder"
              className="nav-link py-2 text-amber font-bold hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Your Scent
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
