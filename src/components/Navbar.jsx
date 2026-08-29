import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
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

  // Determine if header is sitting transparently over a dark background section
  const isDarkHeroPage = location.pathname === "/" || location.pathname === "/about";
  const isTransparent = !isScrolled && isDarkHeroPage;

  const navLinkClass = isTransparent
    ? "text-stone-100 hover:text-amber-300 font-medium text-sm transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
    : "text-stone-800 hover:text-amber font-medium text-sm transition-colors";

  const iconClass = isTransparent
    ? "text-stone-100 hover:text-amber-300 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
    : "text-stone-800 hover:text-amber transition-colors";

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isTransparent
          ? "bg-transparent py-5"
          : "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-stone-100"
      }`}
    >
      <div className="container-custom grid grid-cols-3 items-center gap-4">
        {/* Left: Mobile Menu Toggle & Desktop Navigation */}
        <div className="flex items-center justify-start">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-amber/10 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className={`h-6 w-6 ${iconClass}`} />
            ) : (
              <Bars3Icon className={`h-6 w-6 ${iconClass}`} />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={navLinkClass}>
              Home
            </Link>
            <Link to="/shop" className={navLinkClass}>
              Shop
            </Link>
            <div className="relative group">
              <button className={`flex items-center ${navLinkClass}`}>
                Collections
                <svg
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-amber/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-1">
                  <Link
                    to="/shop?category=men"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber/10 hover:text-amber"
                  >
                    Men
                  </Link>
                  <Link
                    to="/shop?category=women"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber/10 hover:text-amber"
                  >
                    Women
                  </Link>
                  <Link
                    to="/shop?category=unisex"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber/10 hover:text-amber"
                  >
                    Unisex
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/about" className={navLinkClass}>
              About
            </Link>
            <Link to="/contact" className={navLinkClass}>
              Contact
            </Link>
          </nav>
        </div>

        {/* Center: Logo */}
        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3.5 group transition-transform hover:scale-[1.02]"
          >
            <img
              src="/images/essmey-brand-logo.jpg"
              alt="Essmey Logo"
              className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover border border-amber/50 shadow-sm"
            />
            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl md:text-3xl font-serif tracking-[0.16em] font-bold text-amber leading-none">
                ESSMEY
              </span>
              <span
                className={`text-[8px] sm:text-[9px] tracking-[0.28em] uppercase font-medium hidden sm:block mt-1 ${
                  isTransparent ? "text-amber-200/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" : "text-stone-500"
                }`}
              >
                Unveil Your Essence
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Icons & Extra Links */}
        <div className="flex items-center justify-end space-x-3 md:space-x-4">
          <Link
            to="/scent-finder"
            className="hidden lg:inline-flex essmey-learnmore-btn !px-4 !py-2 !text-xs !bg-amber border-none text-white hover:!bg-black hover:!text-white mr-2 shadow-sm"
          >
            Find Your Scent
          </Link>
          <button
            className="p-1 rounded-full hover:bg-amber/10 transition-colors"
            onClick={toggleSearchModal}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className={`h-5 w-5 ${iconClass}`} />
          </button>
          <Link
            to="/wishlist"
            className="p-1 rounded-full hover:bg-amber/10 transition-colors hidden sm:block"
            aria-label="Wishlist"
          >
            <HeartIcon className={`h-5 w-5 ${iconClass}`} />
          </Link>
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className="p-1 rounded-full hover:bg-amber/10 transition-colors hidden sm:flex items-center justify-center"
            title={isAuthenticated ? `Account (${user?.displayName || "User"})` : "Sign In"}
          >
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.displayName}
                className="w-6 h-6 rounded-full object-cover border border-amber-600 shadow-sm"
              />
            ) : (
              <UserIcon className={`h-5 w-5 ${isAuthenticated ? "text-amber-700 font-bold" : iconClass}`} />
            )}
          </Link>
          <Link
            to="/cart"
            className="relative p-1 rounded-full hover:bg-amber/10 transition-colors"
            aria-label="Cart"
          >
            <ShoppingBagIcon className={`h-5 w-5 ${iconClass}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-xs bg-amber text-white rounded-full font-medium shadow-sm">
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
