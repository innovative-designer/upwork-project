import { Fraunces, Space_Grotesk } from "next/font/google";

import { AppProviders } from "@/components/app-providers";

import "./globals.css";

const headingFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading"
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata = {
  title: "Pulseboard Demo",
  description:
    "A shortlist-ready demo with a live dashboard, language switching, RTL support, and Stripe billing."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
