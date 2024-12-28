"use client"
import { Layout } from "@/components/AdminLayout";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
})
 
{
  const router = useRouter();

  // useEffect(() => {
  //   console.log(localStorage.getItem("admin"));
  //   if (!localStorage.getItem("admin")) { // Check local storage
  //     router.push("/admin-login"); // Reroute to login page
  //   }
  // }, [router]); // Add router as a dependency

  return (
    <Layout>
      {/* Include shared UI here e.g. a header or sidebar */}
      {children}
    </Layout>
  );
}
