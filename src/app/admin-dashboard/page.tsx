"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banknote, Users } from "lucide-react";
import AdminBarGraph from "@/components/charts/AdminBarGraph";
import AdminProjectedBarGraph from "@/components/charts/AdminProjectedBarGraph";
import NotificationProfile from "@/components/NotificationProfile";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth"; // Custom fetch function for authenticated requests
import { useRouter } from "next/navigation"; // Import useRouter
import { getUserData, getTransferData,  } from "@/components/utils/api";
import { Clock2 } from "lucide-react";
import ProjectedBarGraph from "@/components/charts/ProjectedBarGraph";
import { CircleCheck, CircleX } from "lucide-react";
import { Loader2 } from "lucide-react";
import { usersApi } from "@/api/users";
import DailyBarGraph from "@/components/charts/DailyBarGraph";
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
     try{
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
          "https://mojoapi.crosslinkglobaltravel.com/api/dashboard"
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
        const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/agent/dashboard");
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        
        setTotalTransactions(data.total_transactions || 0);
        setTotalTransactionsByStatus(data.transactionsByStatus || {});
        
        return data;
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
      fetchAgents()
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
    <div className="min-h-screen bg-gray-50/50">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-primary">Main Dashboard</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/admin-dashboard/settings"
            notificationLink="/admin-dashboard/notifications"
          />
        </div>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:px-12 py-4 bg-gradient-to-r from-gray-50 to-white mt-10 gap-4 sm:gap-0">
        <div className="w-full sm:w-auto">
          {/* Exchange Rate Card */}
          <div className="flex flex-col bg-white rounded-xl px-4 sm:px-6 py-3 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
            <div className="flex flex-col w-full sm:w-auto">
              <span className="text-xs font-medium text-gray-500 mb-1">Exchange Rate</span>
              <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-800">1 USD</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="text-lg font-bold text-primary">127.65 ETB</span>
                </div>
                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">+2.3%</span>
              </div>
              {/* Last Updated - now part of the card */}
              <div className="flex items-center text-xs text-gray-500 mt-1 pt-2 border-t border-gray-100">
                <Clock2 className="h-3 w-3 mr-1" />
                <span className="whitespace-nowrap">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Display */}
        <div className="text-sm font-medium text-gray-700 w-full sm:w-auto text-left sm:text-right">
          {formattedDate.toString()}
        </div>
      </div>

      <main className="p-4 md:p-6 space-y-6 items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
        <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Annual Transactions</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  ${transactionData?.totals?.annual?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </Card>     
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Daily Transactions</p>
              <p className="text-2xl font-bold">
                ${transactionData?.totals?.daily?.toFixed(2) || '0.00'}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Monthly Transactions</p>
              <p className="text-2xl font-bold">
                ${transactionData?.totals?.monthly?.toFixed(2) || '0.00'}
              </p>
            </div>
          </Card>
              
           <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Successful Transactions</p>
              <p className="text-2xl font-bold">
                {transactionData?.totals?.successful || 0}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Active Customers</p>
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
              <p className="text-sm text-gray-500">Active Agents</p>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">
                  {agentTotals}
                </p>
              </div>
            </div>
          </Card>
        </div>

   

     
        <div className="py-6">
        <div className="px-6">
          <div className="grid gap-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-12 lg:px-12">
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
