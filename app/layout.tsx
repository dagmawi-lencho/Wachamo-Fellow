import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wachamo Fellowship - Evangelical Students Union",
  description: "Wachamo University Fellowship BSC Team Registration and Management System",
  keywords: ["Wachamo University", "Fellowship", "Christian", "Students Union", "BSC Team"],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
