"use client";
import Link from "next/link";
import { BarChart3, Send, Users2, Settings, LogOut, Menu, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isMobile ? (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md"
        >
          <Menu className="h-5 w-5" />
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 z-20 p-2 bg-white rounded-md transition-all duration-200 ease-in-out ${
            isOpen ? 'left-52' : 'left-4'
          }`}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      )}

      <aside className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'fixed inset-y-0 left-0'} 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 bg-white border-r transition-transform duration-200 ease-in-out
      `}>
        {isMobile && isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div className={`
          ${isMobile ? 'fixed w-64' : 'w-full'} 
          h-full bg-white flex flex-col z-40
        `}>
          <div className="h-16 flex items-center px-4 border-b">
            <Image src="/img/logo.png" alt="Logo" width={120} height={40} />
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-8">
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-3">
                Main
              </h2>
              <div className="space-y-1">
                {[
                  {href: "/agent-dashboard", icon: BarChart3, label: "Dashboard"},
                  {href: "/agent-dashboard/transfer", icon: Send, label: "History"},
                  {href: "/agent-dashboard/user-management", icon: Users2, label: "User Management"},
                ].map(({href, icon: Icon, label}) => (
                  <Button
                    key={href}
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    asChild
                  >
                    <Link href={href} onClick={() => isMobile && setIsOpen(false)}>
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-3">
                Settings
              </h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                  <Link 
                    href="/agent-dashboard/settings"
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    isMobile && setIsOpen(false);
                  }}
                  asChild
                >
                  <Link href="/">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      <main className={`
        flex-1 
        ${!isMobile && isOpen ? 'ml-64' : 'ml-0'}
        transition-[margin] duration-200 ease-in-out
      `}>
        {children}
      </main>
    </div>
  );
}
