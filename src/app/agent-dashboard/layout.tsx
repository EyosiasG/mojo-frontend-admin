import { Layout } from "@/components/AgentLayout";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'], // Include subsets based on your needs
  weight: ['400', '700'], // Specify desired font weights
  variable: '--font-poppins', // Optional: Define a CSS variable for the font
});

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={poppins.className}>
        <Layout>
          {/* Include shared UI here e.g. a header or sidebar */}
          {children}
        </Layout>
      </body>
    </html>


  );
}
