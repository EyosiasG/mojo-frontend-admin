"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Banknote, Users } from "lucide-react";
import AdminBarGraph from "@/components/charts/AdminBarGraph";
import NotificationProfile from "@/components/NotificationProfile";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth"; // Custom fetch function for authenticated requests
import { useRouter } from "next/navigation"; // Import useRouter
import { getUserData, getTransferData, } from "@/components/utils/api";
import { Clock2 } from "lucide-react";
import ProjectedBarGraph from "@/components/charts/ProjectedBarGraph";
import { CircleCheck, CircleX } from "lucide-react";
import { Loader2 } from "lucide-react";
import { usersApi } from "@/api/users";
import DailyBarGraph from "@/components/charts/DailyBarGraph";
import { ArrowLeftRight, Activity } from "lucide-react";
import { adminApi } from "@/api/admin";
interface Transaction {
  id: number;
  amount: string;
  created_at: string;
  // ... other fields
}

export default function Page() {
  const router = useRouter(); // Initialize router
  const [dashboardData, setDashboardData] = useState(null);
  const [transactionData, setTransactionData] = useState(null); // Add new state
  const [customerTotals, setCustomerTotals] = useState(0);
  const [agentTotals, setAgentTotals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalTransactionsByStatus, setTotalTransactionsByStatus] = useState({});
  const [exchangeRate, setExchangeRate] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('daily'); // Add state for selected period
  const [selected, setSelected] = useState("Daily Transactions");

  const cardData = [
    {
      label: "Daily Transactions",
      content: (
        <p className="text-2xl font-bold">
          ${transactionData?.totals?.daily?.toFixed(2) || "0.00"}
        </p>
      ),
    },
    {
      label: "Monthly Transactions",
      content: (
        <p className="text-2xl font-bold">
          ${transactionData?.totals?.monthly?.toFixed(2) || "0.00"}
        </p>
      ),
    },
    {
      label: "Annual Transactions",
      content: (
        <p className="text-2xl font-bold">
          ${transactionData?.totals?.annual?.toFixed(2) || "0.00"}
        </p>
      ),
    },
  ];

  const selectedCard = cardData.find((card) => card.label === selected);


  const date = new Date(2021, 3, 27);
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const calculateTransactionTotals = (transactions: Transaction[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

    console.log('Transactions:', transactions);

    return transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.created_at);
      const amount = parseFloat(transaction.amount);
      const isSuccessful = transaction.status === 'success';

      // Count successful transactions
      if (isSuccessful) {
        acc.successful++;
      }

      // Add to all relevant totals
      if (transactionDate.getFullYear() === now.getFullYear()) {
        acc.annual += amount;

        if (transactionDate.getMonth() === now.getMonth()) {
          acc.monthly += amount;

          if (transactionDate.getDate() === now.getDate()) {
            acc.daily += amount;
          }
        }
      }

      return acc;
    }, { daily: 0, monthly: 0, annual: 0, successful: 0 });
  };


  const statusIcons = {
    success: <CircleCheck color="#11ff00" />,
    failed: <CircleX color="#ff0000" />,
    pending: <Clock2 color="#ff932e" />,
  };
  // Fetch dashboard data
  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/admin/rates/10");
        console.log("Response: ", response);

        if (!response.ok) {
          throw new Error(`Error fetching exchange rate: ${response.statusText}`);
        }

        const data = await response.json(); // Parse the JSON response
        const exchangeRate = data.data.rate;
        console.log("Exchange Rate: ", exchangeRate);
        setExchangeRate(exchangeRate); // Set the exchange rate in state
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
      }
    }



    async function fetchTransactions() {
      try {
        const data = await getTransferData();
        console.log('Raw API response:', data); // Debug log

        const transactions = Array.isArray(data.data) ? data.data : [];
        const totals = calculateTransactionTotals(transactions);
        console.log('Calculated totals:', totals); // Debug log

        setTransactionData({ transactions, totals });
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.message);
      }
    }

    async function fetchUsers() {
      try {
        const data = await usersApi.getTotalCustomers();
        console.log("Total Users: ", data);
        setCustomerTotals(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      }
    }

    async function fetchAgents() {
      try {
        const data = await usersApi.getTotalAgents();
        console.log("Total Agents: ", data);
        setAgentTotals(data);
      } catch (err) {
        console.error("Error fetching agents:", err);
        setError("Failed to load agents.");
      }
    }

    async function fetchDashboardData() {
      try {
        const response = await fetchWithAuth(
          "https://mojoapi.crosslinkglobaltravel.com/api/admin/dashboard"
        ); // Adjust the URL for your backend API
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setDashboardData(data); // Assuming the data structure contains fields like transactions, users, etc.
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchTotalTransactions() {
      try {
        const data = await adminApi.getTotalTransactions();

        setTotalTransactions(data.total_transactions || 0);
        setTotalTransactionsByStatus(data.transactionsByStatus || {});

      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      }
    }

    Promise.all([
      fetchDashboardData(),
      fetchTransactions(),
      fetchUsers(),
      fetchTotalTransactions(),
      fetchAgents(),
      fetchExchangeRate(),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }



  return (
    <div className="min-h-screen bg-blue-50">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-primary">Main Dashboard</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/admin-dashboard/settings"
            notificationLink="/admin-dashboard/notifications"
          />
        </div>
      </header>

      <div className="lg:px-8 sm:px-8 py-4 gap-4 sm:gap-0">
        {/* Date Display */}
        <div className="p-4 text-sm font-medium text-gray-700 w-full sm:w-auto text-left sm:text-right">
          {formattedDate.toString()}
        </div>

        {/* Currency Selector */}
        <div className="w-full sm:w-auto text-left sm:text-right">
          <select
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-slate-200"
            defaultValue="ETB"
          >
            <option value="ETB">ETB</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>


      {/* Selected Card */}

      <main className="p-4 md:p-6 space-y-6 items-center justify-center">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mt-1">Exchange Rate</p>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-800">1 USD</span>
                    <span className="text-gray-400 mx-2">→</span>
                    <span className="text-lg font-bold text-primary">{exchangeRate} ETB</span>
                  </div>
                </div>

              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2 flex flex-col justify-center">
              <p className="text-sm text-gray-500 mt-1">Active Customers</p>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">
                  {customerTotals}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mt-1">Active Agents</p>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">
                  {agentTotals}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mt-1">Total No of Transactions</p>
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">
                  {totalTransactionsByStatus.success}
                </p>
              </div>
            </div>
          </Card>


          <Card className="p-4">
            <div className="space-y-2">
              <select
                className="text-sm text-gray-500"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {cardData.map((card) => (
                  <option key={card.label} value={card.label}>
                    {card.label}
                  </option>
                ))}
              </select>
              <div className="space-y-2 w-fit">
                <div>{selectedCard.content || "0.00"}</div>
              </div>
            </div>
          </Card>

        </div>




        <div className="">
          <div className="">
            <div className="grid gap-6">
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
                <AdminBarGraph />
                <DailyBarGraph />
              </div>

              {/* Calendar and Stats Section */}
              <div className="grid gap-6 md:grid-cols-2">
                <ProjectedBarGraph />

                <Card className="p-6">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Banknote className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">${totalTransactions.toFixed(2)}</div>
                      <div className="text-sm text-gray-500 mb-3">Total Transaction</div>
                      <div className="flex space-x-4">
                        {Object.entries(totalTransactionsByStatus).map(([status, count]) => (
                          <div
                            key={status}
                            className="flex flex-col items-center space-y-2 p-4"
                          >
                            {/* Icon at the top */}
                            <div className="text-2xl">
                              {statusIcons[status] || <span>🔍</span>} {/* Default icon */}
                            </div>
                            {/* Status name */}
                            <span className="capitalize text-gray-600">{status}</span>
                            {/* Status count */}
                            <span className="text-lg font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
