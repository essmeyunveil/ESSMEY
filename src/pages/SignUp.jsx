import { useState } from "react";
import { SignUp } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { SparklesIcon, GiftIcon, TagIcon } from "@heroicons/react/24/outline";

export default function SignUpPage() {
  const navigate = useNavigate();
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkKey && !clerkKey.includes("YOUR_") && clerkKey.startsWith("pk_");

  return (
    <div className="pt-28 pb-20 min-h-[85vh] flex flex-col justify-center items-center bg-[#fbf9f5] px-4">
      {/* Top Toggle Switch between Sign In and Sign Up */}
      <div className="flex items-center gap-1 bg-[#ede6da] p-1.5 rounded-full mb-8 shadow-inner max-w-xs w-full">
        <Link
          to="/login"
          className="flex-1 text-center py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider text-[#634e3f] hover:text-[#2b1d12] transition-all"
        >
          Sign In
        </Link>
        <Link
          to="/sign-up"
          className="flex-1 text-center py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#2b1d12] text-white shadow-sm transition-all"
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
              className="w-16 h-16 rounded-full object-cover border-2 border-[#d9b477]/60 shadow-lg mb-3 hover:scale-105 transition-transform"
            />
          </Link>
          <span className="absolute -bottom-1 -right-1 bg-[#b45309] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/60">
            Join Club
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#291b12] mt-2">Create Your Account</h1>
        <p className="text-sm text-stone-500 mt-1.5">Join the Essmey Olfactory Circle for complimentary discovery samples & private releases.</p>
      </div>

      {/* Member Privileges Banner */}
      <div className="mb-6 max-w-md w-full bg-gradient-to-r from-[#f5ede2] to-[#efe3d3] border border-[#e2d2be] rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7a5327] mb-2 flex items-center gap-1.5">
          <SparklesIcon className="w-4 h-4 text-[#9c6c36]" /> Member Privileges
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 font-medium">
          <div className="flex items-center gap-1.5">
            <GiftIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Complimentary Decants</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Private Launch Access</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        {isClerkConfigured ? (
          <div className="flex justify-center">
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/login"
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
              alert("Account created successfully!");
              navigate("/shop");
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-900 text-sm focus:border-[#2b1d12] focus:ring-1 focus:ring-[#2b1d12] outline-none transition"
                />
              </div>
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-900 text-sm focus:border-[#2b1d12] focus:ring-1 focus:ring-[#2b1d12] outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2b1d12] hover:bg-[#432d1d] text-white font-medium py-3.5 rounded-xl transition shadow-md text-sm mt-2"
              >
                Create Account & Join
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-stone-600">
        Already have an Essmey account?{" "}
        <Link to="/login" className="text-amber-800 font-semibold hover:underline">
          Sign In here →
        </Link>
      </div>
    </div>
  );
}
