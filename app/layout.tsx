import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ApolloProviderWrapper from "./providers/ApolloProviderWrapper";
import Header from "./components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Go2Njemačka Blog",
  description: "Go2Njemačka — Vodič kroz život i rad u Njemačkoj",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-[#F8F9FB] text-slate-900">
        <ApolloProviderWrapper>
          <Header />
          <main className="font-body">
            {children}
          </main>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
