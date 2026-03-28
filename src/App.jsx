import { useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes (longer for better performance)
      gcTime: 1000 * 60 * 60,   // 1 hour cache duration
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Account = lazy(() => import("./pages/Account"));
const Shipping = lazy(() => import("./pages/Shipping"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const TransOrder = lazy(() => import("./pages/TransOrder"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const ScentFinder = lazy(() => import("./pages/ScentFinder"));

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchModal from "./components/SearchModal";
import { AppProvider } from "./utils/context";
import { AuthProvider } from "./utils/AuthContext";
import { ToastProvider } from "./utils/ToastContext";
import ScrollToTop from "./components/ScrollToTop";
import { initToast } from "./utils/analytics";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/admin/*" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
        <Route path="/search" element={<PageTransition><SearchResults /></PageTransition>} />
        <Route path="/account/*" element={<PageTransition><Account /></PageTransition>} />
        <Route path="/shipping" element={<PageTransition><Shipping /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><TransOrder /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
        <Route path="/thank-you" element={<PageTransition><ThankYou /></PageTransition>} />
        <Route path="/order/:orderId" element={<PageTransition><OrderDetails /></PageTransition>} />
        <Route path="/scent-finder" element={<PageTransition><ScentFinder /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // console.log("ServiceWorker registration successful");
          })
          .catch((err) => {
            // console.log("ServiceWorker registration failed: ", err);
          });
      });
    } else if ("serviceWorker" in navigator) {
      // Unregister service worker in development to avoid caching issues
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ChakraProvider>
        <ToastProvider>
          <AuthProvider>
            <AppProvider>
              <ScrollToTop />
              <Toaster position="top-right" toastOptions={{
                style: {
                  background: 'white',
                  color: 'black',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                }
              }} />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <SearchModal />
                <main className="flex-grow">
                    <Suspense fallback={
                      <div className="min-h-[60vh] flex flex-col items-center justify-center p-12">
                        <div className="w-12 h-12 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
                        <div className="text-sm font-serif text-neutral-400 tracking-widest uppercase animate-pulse">
                          Essmey
                        </div>
                      </div>
                    }>
                      <AnimatedRoutes />
                  </Suspense>
                </main>
                <Footer />
              </div>
            </AppProvider>
          </AuthProvider>
        </ToastProvider>
        </ChakraProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
