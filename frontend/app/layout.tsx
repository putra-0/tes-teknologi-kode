import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopLoader from "@/components/top-loader";
import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next";
import { HeaderProvider } from "@/context/header-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "A simple dashboard application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <TopLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <NuqsAdapter>
              <HeaderProvider>{children}</HeaderProvider>
            </NuqsAdapter>
          </ReactQueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
