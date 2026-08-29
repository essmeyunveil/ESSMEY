import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <div className="pt-28 pb-20 min-h-[75vh] flex flex-col justify-center items-center bg-[#faf9f6] px-4">
      <div className="mb-6 text-center flex flex-col items-center">
        <Link to="/">
          <img
            src="/images/essmey-brand-logo.jpg"
            alt="Essmey"
            className="w-16 h-16 rounded-2xl object-cover border border-amber-600/30 shadow-md mb-3 hover:scale-105 transition-transform"
          />
        </Link>
        <h1 className="text-3xl font-serif font-medium text-stone-900 mt-1">Create Your Account</h1>
        <p className="text-sm text-stone-500 mt-1">Join Essmey for bespoke fragrance privileges.</p>
      </div>

      <div className="w-full max-w-md flex justify-center">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/login"
          appearance={{
            variables: {
              colorPrimary: "#b45309",
              colorText: "#1c1917",
              borderRadius: "0.75rem",
              fontFamily: "inherit",
            },
            elements: {
              card: "shadow-[0_18px_60px_rgba(43,29,18,0.08)] border border-stone-200 rounded-2xl bg-white",
              headerTitle: "font-serif text-2xl text-stone-900 font-medium",
              headerSubtitle: "text-stone-500 text-sm",
              formButtonPrimary: "bg-[#2b1d12] hover:bg-[#55351f] text-white font-medium py-3 rounded-xl transition-all shadow-md",
              footerActionLink: "text-amber-700 hover:text-amber-800 font-semibold",
            },
          }}
        />
      </div>

      <div className="mt-8 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link to="/login" className="text-amber-700 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
