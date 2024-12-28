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
import BarGraph from "@/components/charts/BarGraph";
import PieChart from "@/components/charts/PieChart";
import ProjectedBarGraph from "@/components/charts/ProjectedBarGraph";
import NotificationProfile from "@/components/NotificationProfile";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth"; // Custom fetch function for authenticated requests
import { useRouter } from "next/navigation"; // Import useRouter

export default function Page() {
  const router = useRouter(); // Initialize router
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const date = new Date(2021, 3, 27);

  // Fetch dashboard data
  useEffect(() => {
    // if (!localStorage.getItem("admin")) { // Corrected to use getItem
    //   router.push("/admin-login"); // Reroute to login page
    //   return; // Exit the effect
    // }
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
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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

      <main className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Daily Transactions</p>
              <p className="text-2xl font-bold">
                ${dashboardData?.dailyTransactions || 0}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Spend this month</p>
              <p className="text-2xl font-bold">
                ${dashboardData?.monthlySpend || 0}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Sales</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  ${dashboardData?.sales || 0}
                </p>
                <span className="text-xs text-green-500">
                  +{dashboardData?.salesGrowth || 0}% since last month
                </span>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Monthly</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">
                  ${dashboardData?.monthlyRevenue || 0}
                </p>
                <Select defaultValue="usd">
                  <SelectTrigger className="w-[110px]">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span>USD</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Successful Transactions</p>
              <p className="text-2xl font-bold">
                {dashboardData?.successfulTransactions || 0}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Active Users</p>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">
                  {dashboardData?.activeUsers || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BarGraph />

          <div className="flex gap-6 justify-center">
            <PieChart />
            <Card className="p-6 flex-1 justify-center flex ">
              <Calendar mode="single" selected={date} className="" />
            </Card>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ProjectedBarGraph />

          <Card className="p-6 ">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Banknote className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">
                  ${dashboardData?.totalTransaction || 0}
                </div>
                <div className="text-sm text-gray-500">Total Transaction</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
