import type { Metadata } from "next";
import { 
  Geist, 
  Geist_Mono
} from "next/font/google";
import "./external-imports.css";
import "./globals.css";
import "../styles/fonts.css"; // Google Fonts 직접 import

import { StagewiseToolbar } from "@stagewise/toolbar-next";
import ReactPlugin from "@stagewise-plugins/react";
import { AuthProvider } from "@/features/user-auth/_context/AuthContext";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Text editor fonts are loaded via Google Fonts CDN in globals.css
// This ensures consistency between preview and Lambda rendering

export const metadata: Metadata = {
  title: "STAFF AI - AI Avatars for 24/7 Shopping Experiences",
  description: "Create custom AI avatars, showcase products, and generate shopping videos. Embed real-time in stores and websites for seamless customer experiences.",
  keywords: "AI avatars, shopping experience, virtual try-on, product marketing, AI video generation, brand promotion, 24/7 shopping, AI influencer",
  authors: [{ name: "STAFF AI" }],
  creator: "STAFF AI",
  publisher: "STAFF AI",
  robots: "index, follow",
  openGraph: {
    title: "STAFF AI - AI Avatars for 24/7 Shopping Experiences",
    description: "Create custom AI avatars, showcase products, and generate shopping videos. Embed real-time in stores and websites for seamless customer experiences.",
    type: "website",
    locale: "en_US",
    siteName: "STAFF AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "STAFF AI - AI Avatars for 24/7 Shopping Experiences",
    description: "Create custom AI avatars, showcase products, and generate shopping videos. Embed real-time in stores and websites for seamless customer experiences.",
    creator: "@STAFF AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
        <Toaster 
          position="top-right"
          closeButton
          richColors
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
          }}
        />
      </body>
    </html>
  );
}
