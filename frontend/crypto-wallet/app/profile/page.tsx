"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading profile...</p>
        </div>
      </main>
    );
  }

  const initial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/wallet")}
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
              ₿
            </div>

            <div className="text-left">
              <h1 className="font-bold text-lg">Crypto Wallet</h1>
              <p className="text-xs text-slate-400">Your profile</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/wallet")}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-sm"
          >
            ← Wallet
          </button>
        </div>
      </header>

      {/* Main */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Profile Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-10">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg shadow-blue-500/20">
              {initial}
            </div>

            <h2 className="mt-5 text-2xl sm:text-3xl font-bold">
              {user.name}
            </h2>

            <p className="mt-2 text-slate-400 break-all">
              {user.email}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              Account Active
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Account Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  👤
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Full Name
                  </p>
                  <p className="font-medium text-slate-200 mt-1">
                    {user.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  ✉️
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Email Address
                  </p>

                  <p className="font-medium text-slate-200 mt-1 break-all">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* User ID */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  🆔
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    User ID
                  </p>

                  <p className="font-medium text-slate-200 mt-1">
                    #{user.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  🔒
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Security
                  </p>

                  <p className="font-medium text-emerald-400 mt-1">
                    JWT Protected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Quick Actions
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => router.push("/wallet")}
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left hover:border-blue-500/40 hover:bg-slate-900 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">My Wallet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    View your balance and wallet
                  </p>
                </div>

                <div className="text-2xl group-hover:scale-110 transition">
                  💰
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/transactions")}
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left hover:border-purple-500/40 hover:bg-slate-900 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Transactions</p>
                  <p className="text-sm text-slate-400 mt-1">
                    View your transaction history
                  </p>
                </div>

                <div className="text-2xl group-hover:scale-110 transition">
                  📊
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 py-3.5 font-medium transition"
          >
            🚪 Logout
          </button>

          <p className="text-center text-xs text-slate-600 mt-4">
            Crypto Wallet Demo • Secure session
          </p>
        </div>
      </section>
    </main>
  );
}