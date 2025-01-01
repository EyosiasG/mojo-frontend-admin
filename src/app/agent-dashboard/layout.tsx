"use client"
import { Layout } from "@/components/AgentLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}){
  const router = useRouter();
  useEffect(() => {
    console.log(localStorage.getItem("agent"));
    if (!localStorage.getItem("agent")) { // Check local storage
      router.push("/"); // Reroute to login page
    }
  }, [router]); 
  return <Layout>{children}</Layout>;
}
