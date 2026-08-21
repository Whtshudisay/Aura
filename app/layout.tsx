import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURA — Guided Breathwork",
  description: "Find your center with calm, guided breathing sessions.",
  applicationName: "AURA",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AURA",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#101415",
  width: "device-width",
  initialScale: 1,
};

/**
 * Brave / wallet extensions sometimes touch window.ethereum before it exists.
 * Aura is not a web3 app — this stub only prevents a crash on mobile Brave.
 */
const ethereumGuard = `
(function () {
  try {
    if (typeof window === "undefined") return;
    if (window.ethereum == null) {
      Object.defineProperty(window, "ethereum", {
        configurable: true,
        writable: true,
        value: {
          selectedAddress: undefined,
          isAuraGuard: true,
          request: function () {
            return Promise.reject(new Error("No wallet"));
          },
          on: function () {},
          removeListener: function () {},
        },
      });
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ethereumGuard }} />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
