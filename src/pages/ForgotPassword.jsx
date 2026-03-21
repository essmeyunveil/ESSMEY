import { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
// import { useToast } from "../utils/ToastContext";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      addToast(
        "Password reset email sent. Please check your inbox.",
        "success"
      );
      setLoading(false);
    } catch (err) {
      addToast(
        "Failed to send password reset email. Please try again.",
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-[70vh] flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-semibold mb-8 text-center text-amber-600">
          Forgot Password
        </h1>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 font-medium text-gray-700"
          >
            Enter your email address
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-md font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-amber-600 hover:underline font-semibold"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
