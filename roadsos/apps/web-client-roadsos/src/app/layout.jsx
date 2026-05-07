import "./globals.css";
import { Providers } from "./providers";
import MainLayout from "@/shared/components/layout/MainLayout";

export const metadata = {
  title: "RoadSOS - Emergency Response",
  description: "National Road Safety Hackathon 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ef4444" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RoadSoS" />
      </head>
      <body className="antialiased min-h-screen bg-[#0A0D14] overflow-x-hidden">
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}