import { Layout } from "@/components/AgentLayout";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      {/* Include shared UI here e.g. a header or sidebar */}
      {children}
    </Layout>
  );
}
