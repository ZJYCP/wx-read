import type { Metadata } from "next";
import "./globals.css";

 

export const metadata: Metadata = {
  title: "阅读",
  description: "阅读",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
