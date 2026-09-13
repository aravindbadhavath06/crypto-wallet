"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!isLogin && !name) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin
        ? "http://localhost:8080/api/auth/login"
        : "http://localhost:8080/api/auth/signup";

      const body = isLogin
        ? {
            email,
            password,
          }
        : {
            name,
            email,
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Something went wrong."
        );
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
          })
        );

        router.push("/wallet");
      } else {
        setMessage("Account created successfully! Please login.");

        setName("");
        setEmail("");
        setPassword("");

        setIsLogin(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
              ₿
            </div>

            <div>
              <h1 className="font-bold text-lg">
                Crypto Wallet
              </h1>

              <p className="text-xs text-slate-500">
                Digital Wallet Demo
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
            Secure Connection
          </div>
        </div>
      </nav>

      {/* Main content */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left side */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
              <span>⚡</span>
              Simple. Secure. Digital.
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Your crypto.
              <br />

              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Your wallet.
              </span>
            </h2>

            <p className="mt-6 text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Manage your digital wallet, send funds, receive payments,
              and track every transaction from one simple dashboard.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-sm font-medium">
                  Manage Funds
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-2xl mb-2">↗️</div>
                <p className="text-sm font-medium">
                  Send & Receive
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-medium">
                  Track Activity
                </p>
              </div>
            </div>
          </div>

          {/* Auth card */}
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8">

              {/* Card header */}
              <div className="text-center mb-7">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center text-2xl mb-4">
                  {isLogin ? "🔐" : "🚀"}
                </div>

                <h3 className="text-2xl font-bold">
                  {isLogin
                    ? "Welcome Back"
                    : "Create Account"}
                </h3>

                <p className="text-sm text-slate-400 mt-2">
                  {isLogin
                    ? "Login to access your wallet"
                    : "Create your crypto wallet account"}
                </p>
              </div>

              {/* Toggle */}
              <div className="grid grid-cols-2 bg-slate-950 rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                    setMessage("");
                  }}
                  className={`py-2.5 rounded-lg text-sm font-medium transition ${
                    isLogin
                      ? "bg-slate-800 text-white shadow"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                    setMessage("");
                  }}
                  className={`py-2.5 rounded-lg text-sm font-medium transition ${
                    !isLogin
                      ? "bg-slate-800 text-white shadow"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Messages */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  ⚠️ {error}
                </div>
              )}

              {message && (
                <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  ✓ {message}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Name */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/10 hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isLogin
                        ? "Logging in..."
                        : "Creating account..."}
                    </span>
                  ) : isLogin ? (
                    "Login to Wallet →"
                  ) : (
                    "Create Account →"
                  )}
                </button>
              </form>

              {/* Security note */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-600">
                  🔒 Your session is protected using JWT authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs text-slate-600">
            Crypto Wallet Demo • Built with Next.js, Spring Boot & PostgreSQL
          </p>
        </div>
      </footer>
    </main>
  );
}