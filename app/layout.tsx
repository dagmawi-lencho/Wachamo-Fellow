import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wachamo Fellowship - Evangelical Students Union",
  description: "We are the Wachamo University Evangelical Students Union Fellowship - a passionate community dedicated to glorifying God through worship, discipleship, and service.",
  keywords: ["Wachamo University", "Fellowship", "Christian", "Students Union", "Evangelical", "Bible Study", "Discipleship", "Worship"],
  authors: [{ name: "Dagmawi Lencho" }],
  creator: "Dagmawi Lencho",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Wachamo Fellowship - Evangelical Students Union",
    description: "We are the Wachamo University Evangelical Students Union Fellowship - a passionate community dedicated to glorifying God through worship, discipleship, and service.",
    url: "https://wachamo-fellow1.vercel.app",
    siteName: "Wachamo Fellowship",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Wachamo Fellowship Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Wachamo Fellowship - Evangelical Students Union",
    description: "We are the Wachamo University Evangelical Students Union Fellowship - a passionate community dedicated to glorifying God through worship, discipleship, and service.",
    images: ['/logo.png'],
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
