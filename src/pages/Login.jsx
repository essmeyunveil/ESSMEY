import { useEffect, useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";
import { useToastContext } from "../utils/ToastContext";
import { SparklesIcon, ShieldCheckIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const { user } = useAuth();
  const { addToast } = useToastContext() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [useClerk, setUseClerk] = useState(true);

  // Show toast notification if redirected from checkout
  useEffect(() => {
    const fromCheckout = location.state?.from === "/checkout";
    if (fromCheckout && addToast) {
      addToast(
        location.state.message || "Please sign in to proceed with checkout",
        "info"
      );
    }
  }, [location.state, addToast]);

  if (user) {
    const fromPath = location.state?.from || "/account";
    return <Navigate to={fromPath} replace />;
  }

  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkKey && !clerkKey.includes("YOUR_") && clerkKey.startsWith("pk_");

  return (
    <div className="pt-28 pb-20 min-h-[85vh] flex flex-col justify-center items-center bg-[#fbf9f5] px-4">
      {/* Top Toggle Switch between Sign In and Sign Up */}
      <div className="flex items-center gap-1 bg-[#ede6da] p-1.5 rounded-full mb-8 shadow-inner max-w-xs w-full">
        <Link
          to="/login"
          className="flex-1 text-center py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#2b1d12] text-white shadow-sm transition-all"
        >
          Sign In
        </Link>
        <Link
          to="/sign-up"
          className="flex-1 text-center py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider text-[#634e3f] hover:text-[#2b1d12] transition-all"
        >
          Create Account
        </Link>
      </div>

      <div className="mb-6 text-center flex flex-col items-center max-w-md">
        <div className="relative">
          <Link to="/">
            <img
              src="/images/essmey-brand-logo.jpg"
              alt="Essmey"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#b45309]/40 shadow-lg mb-3 hover:scale-105 transition-transform"
            />
          </Link>
          <span className="absolute -bottom-1 -right-1 bg-[#2b1d12] text-[#e4c58f] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#e4c58f]/40">
            Member
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#291b12] mt-2">Welcome Back</h1>
        <p className="text-sm text-stone-500 mt-1.5">Sign in to your Essmey account to access orders and exclusive olfactory privileges.</p>
      </div>

      <div className="w-full max-w-md">
        {isClerkConfigured && useClerk ? (
          <div className="flex justify-center">
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/sign-up"
              appearance={{
                variables: {
                  colorPrimary: "#b45309",
                  colorText: "#1c1917",
                  borderRadius: "1rem",
                  fontFamily: "inherit",
                },
                elements: {
                  card: "shadow-[0_20px_70px_rgba(43,29,18,0.08)] border border-stone-200/80 rounded-2xl bg-white",
                  headerTitle: "font-serif text-2xl text-stone-900 font-medium",
                  headerSubtitle: "text-stone-500 text-sm",
                  formButtonPrimary: "bg-[#2b1d12] hover:bg-[#432d1d] text-white font-medium py-3 rounded-xl transition-all shadow-md",
                  footerActionLink: "text-amber-800 hover:text-amber-900 font-semibold",
                },
              }}
            />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-[0_20px_70px_rgba(43,29,18,0.08)]">
            <form onSubmit={(e) => {
              e.preventDefault();
              alert("Signed in successfully!");
              navigate("/shop");
            }} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@domain.com"
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-900 text-sm focus:border-[#2b1d12] focus:ring-1 focus:ring-[#2b1d12] outline-none transition"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Password
                  </label>
                  <a href="#" className="text-xs text-amber-800 hover:underline">Forgot password?</a>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-900 text-sm focus:border-[#2b1d12] focus:ring-1 focus:ring-[#2b1d12] outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2b1d12] hover:bg-[#432d1d] text-white font-medium py-3.5 rounded-xl transition shadow-md text-sm"
              >
                Sign In to Essmey
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Trust & Guarantee highlights */}
      <div className="mt-10 grid grid-cols-2 gap-4 max-w-md w-full text-center text-xs text-stone-500">
        <div className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-stone-100/70 border border-stone-200/60">
          <ShieldCheckIcon className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Encrypted Session</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-stone-100/70 border border-stone-200/60">
          <LockClosedIcon className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Private & Secure</span>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-stone-600">
        New to Essmey?{" "}
        <Link to="/sign-up" className="text-amber-800 font-semibold hover:underline">
          Create an account for bespoke privileges →
        </Link>
      </div>
    </div>
  );
};

export default Login;
