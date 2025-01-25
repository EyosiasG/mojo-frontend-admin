import { useRouter } from "next/navigation";
import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  subsets: ["latin"], // Specify subsets (optional)
  weight: ["400", "500", "600", "700"], // Include desired font weights
  style: ["normal", "italic"], // Specify styles (optional)
  variable: "--font-poppins", // Optional: Define a CSS variable
});

export const metadata: Metadata = {
  title: "Mojo Money Transfer",
  description: "Mojo Money Transfer",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased bg-blue-50` }>
        {children}
      </body>
    </html>
  );
}

