import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Election Process Education",
  description: "A highly accessible guide to the election process for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
