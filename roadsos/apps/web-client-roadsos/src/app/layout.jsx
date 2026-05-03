import "./globals.css";

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
      <body className="antialiased min-h-screen bg-emergency-bg selection:bg-primary/30 overflow-x-hidden">
        <div className="relative flex min-h-screen flex-col max-w-md mx-auto shadow-2xl border-x border-white/5">
          {children}
        </div>
      </body>
    </html>
  );
}