"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Transaction = {
  id: number;
  senderEmail: string | null;
  receiverEmail: string | null;
  amount: number;
  type: string;
  createdAt: string;
};

export default function Transactions() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUserEmail(user.email || "");
    } catch {
      localStorage.clear();
      router.push("/");
      return;
    }

    fetchTransactions(token);
  }, [router]);

  async function fetchTransactions(token: string) {
    try {
      setError("");

      const response = await fetch(
        "https://crypto-wallet-backend-q9wj.onrender.com/api/wallet/transactions",
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
        throw new Error("Failed to load transactions.");
      }

      const data = await response.json();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || "Unable to load transactions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function refreshTransactions() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    setRefreshing(true);
    await fetchTransactions(token);
  }

  function getTransactionInfo(transaction: Transaction) {
    const type = transaction.type?.toUpperCase();

    if (type === "DEPOSIT") {
      return {
        title: "Deposit",
        description: "Funds added to your wallet",
        icon: "↓",
        iconBg: "bg-green-500/15",
        iconColor: "text-green-400",
        amountColor: "text-green-400",
        prefix: "+",
      };
    }

    if (type === "WITHDRAW") {
      return {
        title: "Withdraw",
        description: "Funds withdrawn from your wallet",
        icon: "↑",
        iconBg: "bg-red-500/15",
        iconColor: "text-red-400",
        amountColor: "text-red-400",
        prefix: "-",
      };
    }

    if (
      type === "SEND" &&
      transaction.receiverEmail?.toLowerCase() ===
        userEmail.toLowerCase()
    ) {
      return {
        title: "Receive",
        description: `Received from ${
          transaction.senderEmail || "another user"
        }`,
        icon: "↓",
        iconBg: "bg-green-500/15",
        iconColor: "text-green-400",
        amountColor: "text-green-400",
        prefix: "+",
      };
    }

    if (type === "SEND") {
      return {
        title: "Send",
        description: `Sent to ${
          transaction.receiverEmail || "another user"
        }`,
        icon: "↗",
        iconBg: "bg-blue-500/15",
        iconColor: "text-blue-400",
        amountColor: "text-red-400",
        prefix: "-",
      };
    }

    return {
      title: type || "Transaction",
      description: "Wallet activity",
      icon: "•",
      iconBg: "bg-gray-500/15",
      iconColor: "text-gray-400",
      amountColor: "text-gray-300",
      prefix: "",
    };
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const totalTransactions = transactions.length;

  const receivedAmount = transactions
    .filter((transaction) => {
      const info = getTransactionInfo(transaction);
      return info.prefix === "+";
    })
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const sentAmount = transactions
    .filter((transaction) => {
      const info = getTransactionInfo(transaction);
      return info.prefix === "-";
    })
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

          <div>
            <button
              onClick={() => router.push("/wallet")}
              className="text-blue-400 hover:text-blue-300 mb-4 transition"
            >
              ← Back to Wallet
            </button>

            <h1 className="text-4xl font-bold">
              Transactions
            </h1>

            <p className="text-gray-500 mt-2">
              Track all activity in your wallet
            </p>
          </div>

          <button
            onClick={refreshTransactions}
            disabled={refreshing}
            className="bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-xl px-5 py-3 font-semibold transition disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "↻ Refresh"}
          </button>

        </div>

        {/* Summary */}
        {!loading && transactions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-gray-500 text-sm">
                Total Transactions
              </p>

              <p className="text-3xl font-bold mt-2">
                {totalTransactions}
              </p>
            </div>

            <div className="bg-slate-900 border border-green-900/40 rounded-2xl p-5">
              <p className="text-gray-500 text-sm">
                Total Received
              </p>

              <p className="text-3xl font-bold text-green-400 mt-2">
                +${receivedAmount.toFixed(2)}
              </p>
            </div>

            <div className="bg-slate-900 border border-red-900/40 rounded-2xl p-5">
              <p className="text-gray-500 text-sm">
                Total Sent
              </p>

              <p className="text-3xl font-bold text-red-400 mt-2">
                -${sentAmount.toFixed(2)}
              </p>
            </div>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <div className="mx-auto w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />

            <p className="text-gray-500 mt-4">
              Loading transactions...
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400">
            ⚠️ {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && transactions.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">

            <div className="text-5xl mb-5">
              📭
            </div>

            <h2 className="text-2xl font-bold">
              No Transactions Yet
            </h2>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Your deposits, withdrawals, sends and received funds
              will appear here.
            </p>

            <button
              onClick={() => router.push("/wallet")}
              className="mt-6 bg-blue-600 hover:bg-blue-500 rounded-xl px-6 py-3 font-semibold transition"
            >
              Go to Wallet
            </button>

          </div>
        )}

        {/* Transaction List */}
        {!loading && !error && transactions.length > 0 && (
          <div className="space-y-4">

            {transactions.map((transaction) => {

              const info = getTransactionInfo(transaction);

              return (
                <div
                  key={transaction.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition"
                >

                  <div className="flex items-center justify-between gap-4">

                    {/* Left */}
                    <div className="flex items-center gap-4 min-w-0">

                      <div
                        className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-2xl ${info.iconBg} ${info.iconColor}`}
                      >
                        {info.icon}
                      </div>

                      <div className="min-w-0">

                        <div className="flex items-center gap-3">

                          <h2 className="font-bold text-lg">
                            {info.title}
                          </h2>

                          <span className="hidden sm:inline-block text-xs uppercase bg-slate-800 text-gray-500 px-2 py-1 rounded-md">
                            {transaction.type}
                          </span>

                        </div>

                        <p className="text-gray-400 text-sm truncate">
                          {info.description}
                        </p>

                        <p className="text-gray-600 text-xs mt-1">
                          {formatDate(transaction.createdAt)}
                        </p>

                      </div>

                    </div>

                    {/* Amount */}
                    <div
                      className={`font-bold text-lg whitespace-nowrap ${info.amountColor}`}
                    >
                      {info.prefix}$
                      {Number(transaction.amount).toFixed(2)}
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* Bottom */}
        {!loading && transactions.length > 0 && (
          <div className="text-center mt-8">

            <button
              onClick={() => router.push("/wallet")}
              className="text-blue-400 hover:text-blue-300 transition"
            >
              ← Return to Wallet
            </button>

          </div>
        )}

      </div>

    </main>
  );
}