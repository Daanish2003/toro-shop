import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import getSession from "@/helpers/query/getSession";
import { SessionProvider } from "@/components/provider/sessionProvider";
import Navbar from "@/components/navbar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  console.log(session)
  return (
    <html lang="en">
      <body className={inter.className}>
          <SessionProvider value={session}>
                 <Navbar />
                 {children}
          </SessionProvider>
      </body>
    </html>
  );
}
