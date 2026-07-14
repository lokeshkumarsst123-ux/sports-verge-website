import type { Metadata } from "next";
import { Outfit, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ThemeProvider from "@/components/ThemeProvider";
import Script from "next/script";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SportsVerge - Premium Sports Data & Live Analytics Platform",
  description: "Experience real-time sports statistics, predictive analytics, and premium content on the Next-Gen sports platform.",
  keywords: "sports analytics, real-time sports, live sports statistics, sports verge",
  authors: [{ name: "SportsVerge Team" }],
  icons: {
    icon: "/assets/imgs/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/assets/imgs/favicon.svg" type="image/png" />

        {/* Lower precedence for external libraries */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          precedence="default"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
          precedence="default"
        />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />

        {/* Higher precedence for custom styles to ensure they override Bootstrap */}
        <link
          rel="stylesheet"
          href="/assets/css/style.css"
          precedence="high"
        />
        <link
          rel="stylesheet"
          href="/assets/css/custom.css"
          precedence="high"
        />
      </head>
      <body>
        <ThemeProvider>
          <Preloader />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}