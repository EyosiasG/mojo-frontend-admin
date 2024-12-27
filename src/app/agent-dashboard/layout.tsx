"use client"
import { useEffect } from 'react';
import { Layout } from "@/components/AgentLayout";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ['latin'], // Include subsets based on your needs
  weight: ['400', '700'], // Specify desired font weights
  variable: '--font-poppins', // Optional: Define a CSS variable for the font
});

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) 

{
  const router = useRouter();

  useEffect(() => {
    console.log(localStorage.getItem("admin"));
    if (!localStorage.getItem("admin")) { // Check local storage
      router.push("/admin-login"); // Reroute to login page
    }
  }, [router]); 
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
