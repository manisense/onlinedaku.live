import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ClientProviders from '@/components/ClientProviders';

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Daku",
  description: "Find the best deals and coupons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
