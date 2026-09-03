import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const bodyFont = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const monoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const headingFont = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amiroutdoormasters.com"),
  title: {
    default: "Amir Outdoor Masters | Landscaping & Outdoor Living",
    template: "%s | Amir Outdoor Masters",
  },
  description:
    "Amir Outdoor Masters delivers full-service landscaping, lawn care, hardscaping, and outdoor living design built to last.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${monoFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
