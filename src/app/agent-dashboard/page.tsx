import { Banknote, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import BarGraph from "@/components/charts/BarGraph";
import PieChart from "@/components/charts/PieChart";
import ProjectedBarGraph from "@/components/charts/ProjectedBarGraph";
import NotificationProfile from "@/components/NotificationProfile";
import Link from "next/link";

export default function DashboardPage() {
  const date = new Date();

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
        <div className="grid gap-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BarGraph />
            <div className="flex gap-6 justify-center">
              <PieChart />
              <Card className="p-6 flex-1 justify-center flex ">
                <Calendar mode="single" selected={date} className="" />
              </Card>
            </div>
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
                  <div className="text-2xl font-bold">$ 500.00</div>
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
