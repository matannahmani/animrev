import "@/styles/globals.css";
import { Metadata } from "next";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "Matan Nahamni",
      url: "https://github.com/matannahmani",
    },
  ],
  creator: "Matan Nahamni",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@matannahmani",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

function SombraEffect() {
  return (
    <div className="fixed flex min-h-screen w-full items-center justify-center">
      <div className="absolute z-10 h-full w-full bg-black opacity-50" />
      <Image
        priority
        className="z-0 blur-sm filter"
        src="/backgrounds/home.jpg"
        alt="home-screen-image"
        fill
      />
    </div>
  );
}

const MyApp = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SombraEffect />
          <div className="px:1 container relative flex min-h-screen flex-col sm:px-2 md:px-4">
            <Navbar />
            <div className="flex flex-auto">{children}</div>
            {/* <SiteFooter /> */}
          </div>
        </ThemeProvider>
        {/* <StyleSwitcher />
          <Analytics /> */}
        <Toaster />
      </body>
    </html>
  );
};

export default MyApp;
