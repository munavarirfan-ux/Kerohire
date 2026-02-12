import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "keroHire",
  description: "HR Psychometric + Interview Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-parchment font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
