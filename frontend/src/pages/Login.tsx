import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  // how to set the isLoading state to true when the user clicks the login button and set it to false when the login is successful or fails?
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      // Based on your log: response.data is the main object,
      // and response.data.data contains everything.
      const payload = response.data.data;

      if (payload && payload.token) {
        // We pass the whole payload as the 'user' object,
        // and payload.token as the 'token' string.
        login(payload, payload.token);

        // Use a small delay or window.location if navigate is still being stubborn
        navigate("/");
      } else {
        console.error("Login structure mismatch", response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-900 via-slate-900 to-black p-4">
      {/* Subtle Background Blob for extra glass depth */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        {/* The Glass Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 mt-2">
              Access your profile intelligence
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading} // 👈 Prevent edits while submitting
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="dave@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading} // 👈 Prevent edits while submitting
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
            >
              Sign In
            </button> */}
            <button
              type="submit"
              disabled={isLoading} // 👈 Disable while loading
              className={`
    w-full font-semibold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]
    ${
      isLoading
        ? "bg-indigo-400 cursor-not-allowed opacity-70"
        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30"
    }
  `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  {/* Simple spinner */}
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
