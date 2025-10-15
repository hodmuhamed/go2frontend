import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApolloProviderWrapper from "./providers/ApolloProviderWrapper";
import Header from "../components/Header";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 text-gray-900 min-h-screen`}
      >
        <ApolloProviderWrapper>
          {/* HEADER */}
          <Header />

          {/* MAIN CONTENT */}
          <main className="pt-24 px-4 sm:px-8 md:px-16 lg:px-24">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="text-center text-sm text-gray-500 mt-16 mb-6">
            © {new Date().getFullYear()} MojShop. Sva prava zadržana.
          </footer>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}

