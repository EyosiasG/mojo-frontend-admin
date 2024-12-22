"use client"
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NotificationProfile from "@/components/NotificationProfile";
import BackLink from "@/components/BackLink";

// Define the type for the transaction data (adjusted to your response structure)
interface Transaction {
  sender: {
    fullName: string;
  };
  recipient: {
    fullName: string;
    accountNo: string;
  };
  transactionDetails: {
    amount: string; // Changed to string based on your response data
    currency: string;
    date: string;
    time: string;
    status: string;
  };
}

export default function TransactionHistory() {
  const { id } = useParams(); // Get the id from URL params
  const [transaction, setTransactions] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transaction data when the component mounts or id changes
  useEffect(() => {
    async function fetchTransaction() {
      if (!id) {
        setError("Transaction ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await fetch(`https://mojoapi.grandafricamarket.com/api/transactions/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
          const transactionData: Transaction = {
            sender: { fullName: data.data.sender_name || "N/A" },
            recipient: { fullName: data.data.receiver_name || "N/A", accountNo: data.data.account_number || "N/A" },
            transactionDetails: {
              amount: data.data.amount || "N/A",
              currency: data.data.bank_name || "N/A", // Adjust according to how you'd like to display the currency
              date: new Date(data.data.created_at).toLocaleDateString() || "N/A",
              time: new Date(data.data.created_at).toLocaleTimeString() || "N/A",
              status: data.data.status || "N/A",
            },
          };
          setTransactions(transactionData); // Set the fetched transaction data
        } else {
          setError(data.message || "Failed to fetch transaction.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [id]); // Re-fetch data if id changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-900">Transaction History</h1>
          <div className="flex items-center gap-4">
            <NotificationProfile
              profileLink="/admin-dashboard/settings"
              notificationLink="/admin-dashboard/notifications"
            />
          </div>
        </div>

        {/* Back Button */}
        <BackLink>
          <ArrowLeft className="w-4 h-4 mr-2" />
          View Transaction
        </BackLink>

        {/* Transaction Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-6">Transaction Information</h2>

          {/* Sender Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Sender Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full name</p>
                <p className="font-medium">{transaction?.sender.fullName}</p>
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Recipient Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full name</p>
                <p className="font-medium">{transaction?.recipient.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account No.</p>
                <p className="font-medium">{transaction?.recipient.accountNo}</p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">{transaction?.transactionDetails.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Currency</p>
                <p className="font-medium">{transaction?.transactionDetails.currency}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{transaction?.transactionDetails.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{transaction?.transactionDetails.time}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="font-medium text-emerald-500">{transaction?.transactionDetails.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
