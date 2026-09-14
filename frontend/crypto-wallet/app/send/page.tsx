"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Send() {
  const router = useRouter();

  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");

  const [balance, setBalance] = useState(0);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    fetchWallet(token);
  }, [router]);

  async function fetchWallet(token: string) {
    try {
      const response = await fetch(
        "https://crypto-wallet-backend-q9wj.onrender.com/api/wallet/me",
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
        throw new Error("Unable to load wallet");
      }

      const data = await response.json();

      setBalance(Number(data.balance));
    } catch (err) {
      setError("Unable to load wallet balance.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/");
      return;
    }

    if (!receiverEmail.trim()) {
      setError("Please enter the receiver's email.");
      return;
    }

    if (!receiverEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    const amountNumber = Number(amount);

    if (!amountNumber || amountNumber <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (amountNumber > balance) {
      setError("Insufficient wallet balance.");
      return;
    }

    // Prevent sending to yourself
    if (userData) {
      try {
        const user = JSON.parse(userData);

        if (
          user.email?.toLowerCase() ===
          receiverEmail.trim().toLowerCase()
        ) {
          setError("You cannot send money to yourself.");
          return;
        }
      } catch {
        // Ignore invalid local user data
      }
    }

    setSending(true);

    try {
      const response = await fetch(
        "https://crypto-wallet-backend-q9wj.onrender.com/api/wallet/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverEmail: receiverEmail.trim(),
            amount: amountNumber,
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
          data.message || "Transaction failed."
        );
      }

      setBalance(Number(data.balance));

      setSuccess(
        `Transaction successful! $${amountNumber.toFixed(
          2
        )} sent to ${receiverEmail.trim()}`
      );

      setReceiverEmail("");
      setAmount("");

      setTimeout(() => {
        router.push("/wallet");
      }, 1800);
    } catch (err: any) {
      setError(
        err.message || "Unable to complete transaction."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">

      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push("/wallet")}
          className="text-blue-400 hover:text-blue-300 mb-8 transition"
        >
          ← Back to Wallet
        </button>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">

          {/* Header */}
          <div className="mb-8">

            <div className="flex items-center gap-4 mb-4">

              <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center text-3xl">
                ↗
              </div>

              <div>
                <h1 className="text-3xl font-bold text-blue-400">
                  Send Funds
                </h1>

                <p className="text-gray-500">
                  Transfer funds securely to another user
                </p>
              </div>

            </div>

          </div>

          {/* Balance */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-7">

            <p className="text-gray-400 text-sm">
              Available Balance
            </p>

            {loading ? (
              <div className="h-8 w-32 bg-slate-700 rounded-lg animate-pulse mt-2" />
            ) : (
              <p className="text-3xl font-bold mt-1">
                ${balance.toFixed(2)}
              </p>
            )}

          </div>

          {/* Receiver */}
          <div className="mb-6">

            <label className="block text-gray-400 mb-2">
              Receiver Email
            </label>

            <input
              type="email"
              value={receiverEmail}
              onChange={(e) => {
                setReceiverEmail(e.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="Enter receiver email"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />

          </div>

          {/* Amount */}
          <div className="mb-6">

            <label className="block text-gray-400 mb-2">
              Amount
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                $
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />

            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mt-3">

              {[10, 50, 100].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(String(value))}
                  className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-400 hover:text-white hover:border-blue-500 transition"
                >
                  ${value}
                </button>
              ))}

            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-4 mb-6">
              ✓ {success}
              <p className="text-sm text-green-500 mt-1">
                Returning to wallet...
              </p>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={sending || loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-4 font-semibold text-lg transition"
          >
            {sending ? "Processing Transaction..." : "Send Funds"}
          </button>

          {/* Security note */}
          <p className="text-center text-gray-600 text-sm mt-5">
            🔒 Your transaction is protected by authentication.
          </p>

        </div>

      </div>

    </main>
  );
}