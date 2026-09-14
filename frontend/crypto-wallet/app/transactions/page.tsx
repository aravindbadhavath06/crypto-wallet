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
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUserEmail(user.email);
    } catch {
      localStorage.clear();
      router.push("/");
      return;
    }

    fetchTransactions(token);
  }, [router]);

  async function fetchTransactions(token: string) {
    try {
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
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Transaction error:", error);
    } finally {
      setLoading(false);
    }
  }

  function getTransactionDetails(transaction: Transaction) {
    const type = transaction.type?.toUpperCase();

    // Normal deposit
    if (type === "DEPOSIT") {
      return {
        title: "DEPOSIT",
        description: "Received into your wallet",
        icon: "↓",
        color: "text-green-400",
        bg: "bg-green-900/40",
        amountPrefix: "+",
      };
    }

    // Withdraw
    if (type === "WITHDRAW") {
      return {
        title: "WITHDRAW",
        description: "Withdrawn from your wallet",
        icon: "↑",
        color: "text-red-400",
        bg: "bg-red-900/40",
        amountPrefix: "-",
      };
    }

    // If SEND is stored for the receiver,
    // detect it using the logged-in user's email.
    if (
      type === "SEND" &&
      transaction.receiverEmail &&
      transaction.receiverEmail.toLowerCase() === userEmail.toLowerCase()
    ) {
      return {
        title: "RECEIVE",
        description: `Received from ${transaction.senderEmail || "another user"}`,
        icon: "↓",
        color: "text-green-400",
        bg: "bg-green-900/40",
        amountPrefix: "+",
      };
    }

    // Normal SEND
    if (type === "SEND") {
      return {
        title: "SEND",
        description: `Sent to ${transaction.receiverEmail || "another user"}`,
        icon: "↗",
        color: "text-red-400",
        bg: "bg-blue-900/40",
        amountPrefix: "-",
      };
    }

    // Fallback
    return {
      title: type || "TRANSACTION",
      description: "Wallet transaction",
      icon: "•",
      color: "text-gray-400",
      bg: "bg-gray-800",
      amountPrefix: "",
    };
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push("/wallet")}
              className="text-blue-400 hover:text-blue-300 mb-4"
            >
              ← Back to Wallet
            </button>

            <h1 className="text-4xl font-bold text-blue-400">
              Transaction History
            </h1>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 text-center">
            <p className="text-gray-400 text-lg">
              Loading transactions...
            </p>
          </div>
        )}

        {/* No transactions */}
        {!loading && transactions.length === 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 text-center">
            <p className="text-gray-400 text-lg">
              No transactions yet.
            </p>
          </div>
        )}

        {/* Transactions */}
        {!loading && transactions.length > 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5">

            {transactions.map((transaction) => {
              const details = getTransactionDetails(transaction);

              return (
                <div
                  key={transaction.id}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center justify-between gap-6"
                >

                  {/* Left side */}
                  <div className="flex items-center gap-5 min-w-0">

                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${details.bg} ${details.color}`}
                    >
                      {details.icon}
                    </div>

                    {/* Information */}
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold">
                        {details.title}
                      </h2>

                      <p className="text-gray-400 truncate">
                        {details.description}
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div
                    className={`text-xl font-bold whitespace-nowrap ${
                      details.amountPrefix === "+"
                        ? "text-green-400"
                        : details.amountPrefix === "-"
                        ? "text-red-400"
                        : "text-gray-300"
                    }`}
                  >
                    {details.amountPrefix}$
                    {Number(transaction.amount).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}