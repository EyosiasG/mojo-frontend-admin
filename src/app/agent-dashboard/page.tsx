"use client"

import { Banknote, Send } from "lucide-react";
import { CircleCheck, CircleX, Clock2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import BarGraph from "@/components/charts/BarGraph";
import PieChart from "@/components/charts/PieChart";
import ProjectedBarGraph from "@/components/charts/ProjectedBarGraph";
import NotificationProfile from "@/components/NotificationProfile";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";

// Function to fetch total transactions
async function fetchTotalTransactions() {
  try {
    const response = await fetchWithAuth("https://mojoapi.crosslinkglobaltravel.com/api/agent/dashboard");

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Extract total transactions and transactions by status
    const totalTransactions = data.total_transactions;
    const transactionsByStatus = data.transactionsByStatus;

    // Return the relevant data
    return { totalTransactions, transactionsByStatus };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export default function DashboardPage() {


  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalTransactionsByStatus, setTotalTransactionsByStatus] = useState({});
  const [monthlyData, setMonthlyData] = useState<{ month: string; total: number }[]>([]);
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    const getTotal = async () => {
      const { totalTransactions, transactionsByStatus } = await fetchTotalTransactions();
      setTotalTransactions(totalTransactions);
      setTotalTransactionsByStatus(transactionsByStatus);
      setMonthlyData(monthlyData);
    };
    getTotal();
  }, []);

  const today = new Date(); // Replace with the desired date
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long', // Full name of the day
    year: 'numeric',
    month: 'long', // Full name of the month
    day: 'numeric',
  });

  const statusIcons = {
    success: <CircleCheck color="#11ff00" />,
    failed: <CircleX color="#ff0000" />,
    pending: <Clock2 color="#ff932e" />,
  };

  return (
    <>
      <div className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-[#2B3674]">
            Main Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link href="agent-dashboard/transfer/step-one">
              <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
                Send Money
              </Button>
            </Link>
            <NotificationProfile
              profileLink="/agent-dashboard/settings"
              notificationLink="/agent-dashboard/notifications"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div>
          {formattedDate.toString()}
        </div>
        <div className="p-6">
          <div className="grid gap-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 px-36">
              <BarGraph />

            </div>

            {/* Calendar and Stats Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ProjectedBarGraph />

              <Card className="p-6 ">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Banknote className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">{totalTransactions.toFixed(2)}</div>
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
    </>
  );
}
