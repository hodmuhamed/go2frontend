import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApolloProviderWrapper from "./providers/ApolloProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MojShop",
  description: "Next.js frontend povezan s WordPress GraphQL backendom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-slate-900`}>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  );
}

