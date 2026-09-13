"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Wallet() {
  const router = useRouter();

  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState<any>(null);

  const [modal, setModal] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const BTC_PRICE = 100000;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      localStorage.clear();
      router.push("/");
      return;
    }

    fetchWallet(token);
  }, [router]);

  async function fetchWallet(token: string) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/wallet/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load wallet");
      }

      const data = await response.json();
      setBalance(Number(data.balance));
    } catch (error) {
      console.error(error);
      setMessage("Unable to load wallet.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTransaction() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    const value = Number(amount);

    if (!value || value <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      const endpoint =
        modal === "deposit"
          ? "/api/wallet/deposit"
          : "/api/wallet/withdraw";

      const response = await fetch(
        `http://localhost:8080${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: value,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        router.push("/");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Transaction failed"
        );
      }

      setBalance(Number(data.balance));

      setMessage(
        modal === "deposit"
          ? `Successfully deposited $${value.toFixed(2)}`
          : `Successfully withdrew $${value.toFixed(2)}`
      );

      setAmount("");

      setTimeout(() => {
        setModal(null);
        setMessage("");
      }, 1500);
    } catch (error: any) {
      setMessage(error.message || "Transaction failed.");
    } finally {
      setProcessing(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-blue-400">
              Crypto Wallet
            </h1>

            <p className="text-sm text-gray-500">
              Secure digital wallet
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => router.push("/profile")}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold hover:bg-blue-500 transition"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </button>

            <button
              onClick={logout}
              className="hidden sm:block text-gray-400 hover:text-red-400 transition"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Main */}
      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <p className="text-gray-400">
            Welcome back,
          </p>

          <h2 className="text-3xl font-bold mt-1">
            {user?.name || "User"} 👋
          </h2>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl mb-8">

          <div className="flex items-center justify-between mb-6">

            <div>
              <p className="text-blue-100 text-sm">
                Total Balance
              </p>

              {loading ? (
                <div className="h-12 w-48 bg-blue-500/40 rounded-lg animate-pulse mt-2" />
              ) : (
                <h2 className="text-5xl font-bold mt-2">
                  ${balance.toFixed(2)}
                </h2>
              )}
            </div>

            <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center text-3xl">
              ₿
            </div>

          </div>

          <div className="border-t border-white/20 pt-5">

            <p className="text-blue-100 text-sm">
              Bitcoin Equivalent
            </p>

            <p className="text-xl font-semibold mt-1">
              {(balance / BTC_PRICE).toFixed(6)} BTC
            </p>

          </div>
        </div>

        {/* Market Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-orange-500/15 flex items-center justify-center text-2xl">
                ₿
              </div>

              <div>
                <p className="font-semibold">
                  Bitcoin
                </p>

                <p className="text-sm text-gray-500">
                  BTC / USD
                </p>
              </div>

            </div>

            <div className="text-right">

              <p className="text-xl font-bold">
                ${BTC_PRICE.toLocaleString()}
              </p>

              <p className="text-sm text-green-400">
                Demo market price
              </p>

            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">

          <h3 className="text-xl font-semibold mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <button
              onClick={() => router.push("/send")}
              className="bg-blue-600 hover:bg-blue-500 rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <div className="text-2xl mb-2">↗</div>
              <p className="font-semibold">Send</p>
            </button>

            <button
              onClick={() => router.push("/receive")}
              className="bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <div className="text-2xl mb-2">↙</div>
              <p className="font-semibold">Receive</p>
            </button>

            <button
              onClick={() => setModal("deposit")}
              className="bg-slate-900 border border-slate-700 hover:border-green-500 rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <div className="text-2xl mb-2">＋</div>
              <p className="font-semibold">Deposit</p>
            </button>

            <button
              onClick={() => setModal("withdraw")}
              className="bg-slate-900 border border-slate-700 hover:border-red-500 rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <div className="text-2xl mb-2">−</div>
              <p className="font-semibold">Withdraw</p>
            </button>

          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between gap-4">

            <div>
              <h3 className="text-xl font-semibold">
                Transaction History
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                View all your wallet activity
              </p>
            </div>

            <button
              onClick={() => router.push("/transactions")}
              className="text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap"
            >
              View All →
            </button>

          </div>

        </div>

      </section>

      {/* Deposit / Withdraw Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">

          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-7 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                {modal === "deposit"
                  ? "Deposit Funds"
                  : "Withdraw Funds"}
              </h2>

              <button
                onClick={() => {
                  setModal(null);
                  setAmount("");
                  setMessage("");
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>

            </div>

            <p className="text-gray-400 mb-6">
              {modal === "deposit"
                ? "Enter the amount you want to add to your wallet."
                : "Enter the amount you want to withdraw from your wallet."}
            </p>

            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500 mb-5"
            />

            {message && (
              <p
                className={`mb-5 ${
                  message.toLowerCase().includes("success")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <button
              onClick={handleTransaction}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl py-4 font-semibold transition"
            >
              {processing
                ? "Processing..."
                : modal === "deposit"
                ? "Deposit"
                : "Withdraw"}
            </button>

          </div>
        </div>
      )}

    </main>
  );
}