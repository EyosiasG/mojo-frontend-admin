"use client";
import Link from "next/link";
import { BarChart3, Send, Users2, Settings, LogOut } from "lucide-react";
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
          className="absolute top-4 left-4"
        />
      </button>
      <aside
        className={`${isOpen ? "fixed w-64" : "hidden w-6"}
         left-0 top-0 z-40 h-screen  border-r bg-white`}
        // className="left-0 bg-black"
      >
        <div className="flex justify-between h-16 items-center border-b pl-6 ">
          <div className="flex items-center gap-2 ">
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
                <Link href="/agent-dashboard">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/agent-dashboard/transfer">
                  <Send className="h-4 w-4" />
                  History
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/agent-dashboard/user-management">
                  <Users2 className="h-4 w-4" />
                  User Management
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
                <Link href="/agent-dashboard/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Link href="/" onClick={() => {
                localStorage.removeItem('access_token');
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
