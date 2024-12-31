"use client"
import { Layout } from "@/components/AgentLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
