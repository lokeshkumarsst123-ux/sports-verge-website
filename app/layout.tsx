import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ThemeProvider from "@/components/ThemeProvider";
import FavoritesProvider from "@/components/FavoritesContext";
import AdProvider from "@/components/AdContext";
import SiteSettingsProvider from "@/components/SiteSettingsContext";
import Script from "next/script";
import { headers } from "next/headers";
import { contentApi } from "@/lib/content-api";
import { buildSeoMetadata } from "@/lib/seo";

const fallbackMetadata: Metadata = {
  title: "SportsVerge - Premium Sports Data & Live Analytics Platform",
  description: "Experience real-time sports statistics, predictive analytics, and premium content on the Next-Gen sports platform.",
  keywords: "sports analytics, real-time sports, live sports statistics, sports verge",
  authors: [{ name: "SportsVerge Team" }],
  icons: { icon: "/assets/imgs/favicon.svg" },
};

const getRequestPath = async () => {
  try {
    const requestHeaders = await headers();
    return requestHeaders.get("x-seo-path") || "/";
  } catch {
    return "/";
  }
};

const fallbackFontVariables = {
  "--font-outfit": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "--font-space-grotesk": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "--font-inter": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as CSSProperties;

export async function generateMetadata(): Promise<Metadata> {
  const path = await getRequestPath();
  const seo = await contentApi.seo(path).catch(() => null);
  if (!seo) return fallbackMetadata;
  return {
    ...fallbackMetadata,
    ...buildSeoMetadata(seo.data, {
      title: fallbackMetadata.title,
      description: fallbackMetadata.description,
      keywords: fallbackMetadata.keywords,
    }, path),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = await getRequestPath();
  const seo = await contentApi.seo(path).catch(() => null);
  const structuredData = seo?.data?.settings?.structuredData && Object.keys(seo.data.settings.structuredData).length ? seo.data.settings.structuredData : null;
  return (
    <html lang="en" data-scroll-behavior="smooth" style={fallbackFontVariables}>
      <head>
        {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />}
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
          <Suspense fallback={null}>
            <SiteSettingsProvider>
              <FavoritesProvider>
                <AdProvider>
                  <Preloader />
                  <Header />
                  {children}
                  <Footer />
                </AdProvider>
              </FavoritesProvider>
            </SiteSettingsProvider>
          </Suspense>
        </ThemeProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
