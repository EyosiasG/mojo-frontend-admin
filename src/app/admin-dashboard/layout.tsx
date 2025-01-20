"use client";

import { Layout } from "@/components/AdminLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Poppins } from "next/font/google";

// Import the Poppins font
const poppins = Poppins({
  subsets: ["latin"], // Specify font subsets
  weight: ["400", "500", "600", "700"], // Include desired font weights
  variable: "--font-poppins", // Define a CSS variable for the font
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
      router.push("/admin-login"); // Redirect to admin login if no admin data
    }
  }, [router]);

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Layout>
          {/* Shared UI components like header, sidebar, etc. */}
          {children}
        </Layout>
      </body>
    </html>
  );
}
