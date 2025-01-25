"use client";
import Link from "next/link";
import {
  BarChart3,
  Send,
  Users2,
  Settings,
  LogOut,
  IdCard,
  Activity,
  BadgeCent,
  Bell,
} from "lucide-react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <button type="button" onClick={toggleSidebar} className="">
        <Image
          width={25}
          height={25}
          src={isOpen ? "/icons/chevron_left.svg" : "/icons/chevron_right.svg"}
          alt=""
          className="absolute top-5 left-4"
        />
      </button>
      <aside
        className={`${isOpen ? "fixed w-64" : "hidden w-6"}
         left-0 top-0 z-40 h-screen  border-r bg-white`}
        // className="left-0 bg-black"
      >
        <div className="flex justify-between h-16 items-center border-b pl-6 ">
          <div className="flex items-center gap-2">
            {/* <div className="h-8 w-8 rounded bg-primary"> */}
            {/* <div className="flex h-full items-center justify-center text-lg font-bold text-white"> */}
            <Image src="/img/logo.png" alt="Mojo" width={150} height={150} />
            {/* </div> */}
            {/* </div> */}
          </div>
          <button type="button" onClick={toggleSidebar} className="">
            <Image
              width={25}
              height={25}
              src={
                isOpen ? "/icons/chevron_left.svg" : "/icons/chevron_right.svg"
              }
              alt=""
            />
          </button>
        </div>
        <nav className="space-y-6 px-3 py-4">
          <div>
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Main
            </h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/admin-dashboard">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/admin-dashboard/transactions">
                  <Send className="h-4 w-4" />
                  Transactions
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/admin-dashboard/agent-management">
                  <Users2 className="h-4 w-4" />
                  Agent Management
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/admin-dashboard/user-management">
                  <User className="h-4 w-4" />
                  Sender Management
                </Link>
              
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/admin-dashboard/user-management">
                  <User className="h-4 w-4" />
                  Receiver Management
                </Link>  
              </Button>
              

              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/admin-dashboard/currency">
                  <BadgeCent className="h-4 w-4" />
                  Currency
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/admin-dashboard/exchange-rates">
                  <Activity className="h-4 w-4" />
                  Exchange Rates
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Settings
            </h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/admin-dashboard/notifications">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/admin-dashboard/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Link href="/" onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('admin');
              }}>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${isOpen ? "pl-64" : "pl-6"}`}>{children}</main>
    </div>
  );
}
