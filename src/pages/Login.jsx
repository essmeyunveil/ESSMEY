import { useState,useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";
import { useToastContext } from "../utils/ToastContext";

const Login = () => {
  const { user, login, signup, googleLogin } = useAuth();
  const { addToast } = useToastContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Show toast notification if redirected from checkout
  useEffect(() => {
    const fromCheckout = location.state?.from === "/checkout";
    if (fromCheckout) {
      addToast(location.state.message || "Please login to proceed with checkout", "info");
    }
  }, [location.state, addToast]);

  if (user) {
    // Get the previous path from state or default to account
    const fromPath = location.state?.from || "/account";
    return <Navigate to={fromPath} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const result = await login(email, password);
        const user = result.user;
        // Format the current time
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        // Get user's name from email (before @ symbol)
        const userName = email.split('@')[0];
        
        // Show success toast with user's name and time
        addToast(`${userName} has successfully logged in`, "success");
      } else {
        await signup(email, password);
        addToast("Account created successfully! Please login.", "success");
      }
      setLoading(false);
      // Get the previous path from state or default to account
      const fromPath = location.state?.from || "/account";
      navigate(fromPath);
    } catch (err) {
      const userName = email.split('@')[0];
      addToast(
        isLogin
          ? `${userName} failed to login. Please check your credentials.`
          : `${userName} failed to sign up. Please try again.`,
        "error"
      );
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleLogin();
      setLoading(false);
      navigate("/account");
    } catch (err) {
      addToast("Failed to login with Google.", "error");
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
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="mb-7">
          <label
            htmlFor="password"
            className="block mb-2 font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>
        {!isLogin && (
          <div className="mb-7">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isLogin}
              autoComplete="new-password"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-md font-semibold transition-colors disabled:opacity-50"
        >
          {loading
            ? isLogin
              ? "Logging in..."
              : "Signing up..."
            : isLogin
              ? "Login"
              : "Sign Up"}
        </button>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          {isLogin && (
            <Link
              to="/forgot-password"
              className="text-amber-600 hover:underline font-semibold"
            >
              Forgot Password?
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
            }}
            className="text-amber-600 hover:underline font-semibold"
          >
            {isLogin ? "Create an account" : "Already have an account? Login"}
          </button>
        </div>
        <div className="mt-8 text-center text-gray-500 font-medium">or</div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-6 h-6"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 7.053 29.523 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 16.108 19.013 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 7.053 29.523 5 24 5 16.318 5 9.656 9.945 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 43c5.421 0 10.168-2.184 13.592-5.732l-6.276-5.238C29.91 34.91 27.11 36 24 36c-5.223 0-9.654-3.343-11.303-8l-6.571 5.066C9.656 38.055 16.318 43 24 43z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.025 2.893-3.14 5.243-5.803 6.627l6.276 5.238C38.29 36.816 43.611 29.94 43.611 20.083z"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
