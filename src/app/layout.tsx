import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        {children}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          limit={1}
          closeOnClick={true}
          draggable={false}
          closeButton={true}
          hideProgressBar={true}
          theme="light"
          style={{
            width: 'auto',
            maxWidth: '100%',
            color: 'black',
          }}
        />
      </body>
    </html>
  );
}
