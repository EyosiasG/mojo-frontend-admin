
import { useRouter } from "next/navigation";
import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { Montserrat } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";


// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const montserrat = Montserrat({
  subsets: ['latin'], // Include subsets based on your needs
  weight: ['400', '700'], // Specify desired font weights
  variable: '--font-montserrat', // Optional: Define a CSS variable for the font
});
const dmSans = DM_Sans({
  subsets: ["latin"], // Specify subsets (optional)
  weight: ["400", "500", "700"], // Specify weights (optional)
  style: ["normal", "italic"], // Specify styles (optional)
});
export const metadata: Metadata = {
  title: "Mojo Money Transfer",
  description: "Mojo Money Transfer",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${montserrat} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
