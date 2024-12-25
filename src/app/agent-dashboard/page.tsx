"use client"

import { Banknote, Send } from "lucide-react";
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
    const response = await fetchWithAuth("https://mojoapi.grandafricamarket.com/api/transactions");

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if data is an array
    if (!Array.isArray(data.data)) {
      throw new Error("Expected an array of transactions");
    }

    // Get the current date and the date six months ago
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    // Initialize total amount and monthly totals
    let totalAmount = 0;
    const monthlyTotals: { [key: string]: number } = {};

    data.data.forEach(transaction => {
      const transactionDate = new Date(transaction.created_at);
      if (transactionDate >= sixMonthsAgo && transactionDate <= currentDate) {
        const monthKey = transactionDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        const amount = Number(transaction.amount);

        // Update total amount
        totalAmount += amount;

        // Update monthly totals
        monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amount;

      }
    });

    // Convert the aggregated data into an array for the bar graph
    const aggregatedData = Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total,
    }));

    return { totalAmount, monthlyData: aggregatedData }; // Return both total amount and monthly data
  } catch (error) {
    console.error("Error fetching total transactions:", error.message);
    console.error("Full error object:", error);
    return { totalAmount: 0, monthlyData: [] }; // Return 0 and an empty array on error
  }
}

export default function DashboardPage() {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [monthlyData, setMonthlyData] = useState<{ month: string; total: number }[]>([]);

  useEffect(() => {
    const getTotal = async () => {
      const { totalAmount, monthlyData } = await fetchTotalTransactions();
      setTotalTransactions(totalAmount);
      setMonthlyData(monthlyData);
    };
    getTotal();
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Charts Section */}
          <div className="col-span-1">
            <BarGraph />
          </div>
          <div className="col-span-1">
            <ProjectedBarGraph />
          </div>

          {/* Calendar and Stats Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex gap-6 justify-center">
              <Card className="p-6 flex-1 justify-center flex ">
                <Calendar mode="single" selected={new Date()} className="" />
              </Card>
            </div>

            <Card className="p-6 ">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Banknote className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">${totalTransactions.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Total Transaction</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
